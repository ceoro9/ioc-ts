import { Container } from '../container';
import {
    InjectionDecorator,
    makeConstructorMedata,
    IConstructorMetadata,
} from './types';


const constructorMetadataKey = 'constructor:metadata';


export const InjectConstructor: InjectionDecorator = (dependencyName?: string, container?: Container) => {

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
