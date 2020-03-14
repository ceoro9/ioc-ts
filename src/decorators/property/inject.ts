import * as Exceptions from '../../exceptions';
import { Container } from '../../container';
import { InjectionDecorator } from '../types';

export const InjectProperty: InjectionDecorator = (dependencyName?: string, container?: Container) => {
  return function(target: any, key: string | symbol) {
    const dependencyIdentifier = dependencyName ?? Reflect.getMetadata('design:type', target, key);

    if (!dependencyIdentifier) {
      throw new Exceptions.InvalidDependencyIdentifier();
    }

    return {
      get() {
        const sourceContainer = container ?? Container.getDefault();
        return sourceContainer.get(dependencyIdentifier);
      },
    };
  };
};
