import * as Exceptions from './exceptions';
import { Dependency }  from './dependency';


export function createDependencyProxyObject(proxifiedObject: any) {
  return new Proxy(proxifiedObject, {
    get(target: any, propKey: string) {

      const result = Reflect.get(target, propKey);

      // not injectable property
      if (!(result instanceof Dependency)) {
        return result;
      }

      // check if property is resolved and return actual value
      if (result.isResolved()) {
        return result.getValue();
      }

      // try to resolve dependency based on it design type
      // TODO: create separate function to obtain design type
      let designType;

      if (result.isPropertyInjection()) {
        designType = Reflect.getMetadata("design:type", target, propKey);
      }

      if (result.isConstructorInjection()) {
        const dependencyParamIndex = result.getConstructorIndex();
        designType = Reflect.getMetadata("design:paramtypes", target.constructor)[dependencyParamIndex];
      }

      if (!designType) {
        throw new Exceptions.UnknowInjectionTypeException();
      }

      result.resolve(designType, true);

      if (!result.isResolved()) {
        throw new Exceptions.UnresolvedDependencyException(result);
      }

      return result.getValue();
    }
  })
}
