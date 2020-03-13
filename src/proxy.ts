import * as Exceptions from './exceptions';
import { Dependency }  from './dependency';


export function createDependencyProxyObject<T extends object>(proxifiedObject: object): T {
  return new Proxy(proxifiedObject, {
    get(target: any, propKey: string) {

      const result = Reflect.get(target, propKey);

      // not injectable property
      if (!(result instanceof Dependency)) {
        return result;
      }

      const container  = result.getContainer();
      const identifier = result.getIdentifier();
      const value      = container.getDependencyMember(identifier)?.getDependency();

      if (!value) {
        throw new Exceptions.UnresolvedDependencyException(result);
      }

      return value;
    }
  });
}
