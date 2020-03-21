import * as Constants from '../constants';
import { createDependencyProxyObject } from '../proxy';
import { copyFunctionMetadata } from '../utils';
import { Container } from '../container';

/**
 * Marks class entity as injectable
 * @param dependencyName
 */
export function Injectable(dependencyName?: string, container?: Container) {
  return function(target: any) {
    // marks constructor as injectable
    target[Constants.InjectableKey] = true;

    // saves a reference to the original constructor
    const original = target;

    // a utility function to generate instances of a class
    function construct(ctor: any, args: any[]) {
      const innerCtor: any = function() {
        return new ctor(...args);
      };

      innerCtor.prototype = ctor.prototype;
      const result = new innerCtor();

      return createDependencyProxyObject(result);
    }

    // the new constructor behaviour
    const newCtor: any = function(...args: any) {
      return construct(original, args);
    };

    // copies metadata
    copyFunctionMetadata(original, newCtor);

    // adds entity(new constructor) to global container
    const globalContainer = Container.getGlobal();
    if (dependencyName) {
      globalContainer.bind(dependencyName, newCtor);
    } else {
      globalContainer.bind(newCtor);
    }

    // adds entity to the specified container
    if (container) {
      if (dependencyName) {
        container.bind(dependencyName, newCtor);
      } else {
        container.bind(newCtor);
      }
    }

    // returns new constructor (will override original)
    return newCtor;
  };
}
