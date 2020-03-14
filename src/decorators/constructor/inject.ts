import { Container }                       from '../../container';
import { InjectionDecorator }              from '../types';
import { addConstructorParameterMetadata } from './metadata';


export const InjectConstructor: InjectionDecorator = (dependencyName?: string, container?: Container) => {

  return function(target: any, _propertyKey: string | symbol, parameterIndex: number) {
    addConstructorParameterMetadata(target, {
      parameterIndex,
      dependencyName,
      container,
    });
  };
}
