import { ConstructorT } from '../types';
import { createDependencyProxyObject } from '../proxy';

/**
 * Constructs instance of entity
 * @param ctor
 * @param args
 */
export function constructEntityInstance<T>(ctor: ConstructorT<T>, args: unknown[]) {
  const innerCtor: any = function() {
    return new ctor(...args);
  };

  innerCtor.prototype = ctor.prototype;
  const result = new innerCtor();

  return createDependencyProxyObject(result) as T; // TODO
}
