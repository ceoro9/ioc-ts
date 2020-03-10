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


/**
 * Property injection
 */
export function InjectProperty({ container, dependencyName }: { container?: Container, dependencyName?: string } = {}) {

  return function (target: any, key: string) {

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


// TODO: property injection
export function Inject(target: Object, propertyKey: string | symbol): void;

// TODO: constructor injection
export function Inject(target: Object, propertyKey: string | symbol, parameterIndex: number): void;

export function Inject(_target: Object, _propertyKey: string | symbol, _parameterIndex?: number) {
  // TODO
}
