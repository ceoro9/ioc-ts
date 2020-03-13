import { Dependency } from './dependency';


export function createDependencyProxyObject<T extends object>(proxifiedObject: object): T {
  return new Proxy(proxifiedObject, {
    get(target: any, propKey: string) {

      const result = Reflect.get(target, propKey);

      // not injectable property
      if (!(result instanceof Dependency)) {
        return result;
      }

      // TODO: check in container

      return result.resolve();
    }
  });
}
