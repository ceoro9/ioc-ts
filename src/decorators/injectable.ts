import * as Constants from '../constants';
import { copyFunctionMetadata } from '../utils';
import { constructEntityInstance } from './utils';
import { Container } from '../container';
import { ConstructorT } from '../types';
import { AsyncInjectableInstance, AddContainerBinding } from '../container/types';

const BaseInjectable = (dependencyName?: string, customContainer?: Container) => {
  return function<T>(target: ConstructorT<T>, addBindingToContainer: (container: Container) => AddContainerBinding) {
    // marks constructor as injectable
    (target as any)[Constants.InjectableKey] = true;

    // saves a reference to the original constructor
    const original = target;

    // the new constructor behaviour
    // WHAT THE HELL????
    const newCtor = (function(...args: any) {
      return constructEntityInstance(original, args);
    } as unknown) as ConstructorT<T>;

    // copies metadata
    copyFunctionMetadata(original, newCtor);

    // adds entity to global container
    const globalContainer = Container.getGlobal();
    const bindEntity = addBindingToContainer(globalContainer);
    if (dependencyName) {
      bindEntity(dependencyName, newCtor);
    } else {
      bindEntity(newCtor);
    }

    // adds entity to the custom container
    if (customContainer) {
      const bindEntity = addBindingToContainer(customContainer);
      if (dependencyName) {
        bindEntity(dependencyName, newCtor);
      } else {
        bindEntity(newCtor);
      }
    }

    // returns new constructor (will override original)
    return newCtor;
  };
};

/**
 * Marks class entity as sync injectable
 * @param dependencyName
 * @param container
 */
export const Injectable = (dependencyName?: string, customContainer?: Container) => {
  return function<T>(target: ConstructorT<T>) {
    const targetDecorator = BaseInjectable(dependencyName, customContainer);
    return targetDecorator(target, (container: Container) => container.bind.bind(container));
  };
};

/**
 * Marks class entity as async injectable
 * @param dependencyName
 * @param container
 */
export const AsyncInjectalbe = (dependencyName?: string, customContainer?: Container) => {
  return function<T extends AsyncInjectableInstance>(target: ConstructorT<T>) {
    const targetDecorator = BaseInjectable(dependencyName, customContainer);
    return targetDecorator(target, (container: Container) => container.bindAsync.bind(container));
  };
};
