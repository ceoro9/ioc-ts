import { Container }          from '../container';
import { InjectionDecorator } from './types';
import { InjectConstructor }  from './constructor';
import { InjectProperty }     from './property';


/**
 * Injects dependency
 * @param dependencyName
 * @param container
 */
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
