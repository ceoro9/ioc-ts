import * as Exceptions                 from './exceptions';
import * as Constants                  from './constants';
import { Container }                   from './container';
import { createDependencyProxyObject } from './proxy';
import { copyFunctionMetadata }        from './utils';


/**
 * Marks class entity as injectable
 * @param target entity
 */
export function Injectable(target: any) {

  // mark constructor as injectable
  target[Constants.InjectableKey] = true

  // save a reference to the original constructor
  const original = target;

  // a utility function to generate instances of a class
  function construct(ctor: any, args: any[]) {

    const innerCtor: any = function () {
      return new ctor(...args);
    }

    innerCtor.prototype = ctor.prototype;
    const result = new innerCtor();

    return createDependencyProxyObject(result);
  }

  // the new constructor behaviour
  const newCtor: any = function (...args: any) {
    return construct(original, args);
  }

  // copy metadata
  copyFunctionMetadata(original, newCtor);

  // return new constructor (will override original)
  return newCtor;
}


// Injection function interface
type InjectionDecorator = (dependencyName?: string, container?: Container) => Function;


export const Inject: InjectionDecorator = (dependencyName?: string, container?: Container) => {

  return function(target: Object, propertyKey: string | symbol, parameterIndex?: number) {

    if (parameterIndex !== undefined) {
      InjectConstructor(dependencyName, container)(target, propertyKey, parameterIndex);
    }
    else {
      return InjectProperty(dependencyName, container)(target, propertyKey);
    }
  }
}


const InjectProperty: InjectionDecorator = (dependencyName?: string, container?: Container) => {

  return function(target: any, key: string | symbol) {

    const dependencyIdentifier = dependencyName ?? Reflect.getMetadata("design:type", target, key);

    if (!dependencyIdentifier) {
      throw new Exceptions.InvalidDependencyIdentifier();
    }

    return {
      get() {
        const sourceContainer = container ?? target[Constants.InjectableContainerKey];

        if (!sourceContainer) {
          throw new Exceptions.ContainerNotBinded();
        }

        return sourceContainer.getValue(dependencyIdentifier);
      },
    } as any;
  };
}


const constructorMetadataKey = 'constructor:metadata';


export interface IConstructorMetadata {
  parameterIndex: number;
  dependencyName?: string;
  container?: Container;
}


function makeConstructorMedata(parameterIndex: number,
                               dependencyName?: string,
                               container?: Container): IConstructorMetadata {
  return {
    parameterIndex,
    dependencyName,
    container,
  };
}


const InjectConstructor: InjectionDecorator = (dependencyName?: string, container?: Container) => {

  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {

    const newCtorMetadata = makeConstructorMedata(parameterIndex, dependencyName, container);

    const ctorMetadatas = Reflect.getMetadata(
      constructorMetadataKey,
      target, propertyKey
    ) as {[key: number]: IConstructorMetadata} ?? {};

    Reflect.metadata(
      constructorMetadataKey,
      {
        ...ctorMetadatas,
        [parameterIndex]: newCtorMetadata
      }
    )(target, propertyKey);
  };
}
