import * as Exceptions from './exceptions';
import { Dependency } from './dependency';

export function createDependencyProxyObject<T>(proxifiedObject: T): T {
  return new Proxy(proxifiedObject as any, {
    get(target: any, propKey: string) {
      const result = Reflect.get(target, propKey);

      // not injectable property
      if (!(result instanceof Dependency)) {
        return result;
      }

      const container = result.getContainer();
      const identifier = result.getIdentifier();
      const value = container.getEntityBinding(identifier)?.getEntityValue();

      if (!value) {
        throw new Exceptions.UnresolvedDependencyException(result);
      }

      return value;
    },
  });
}
