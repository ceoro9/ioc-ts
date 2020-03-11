import * as Exceptions                     from './exceptions';
import { Dependency }                      from './dependency';
import { ConstructorT }                    from './types';
import { getConstructorParameterMetadata } from './decorators/constructor/metadata';


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
      let designType: ConstructorT, dependencyName: string;

      if (result.isPropertyInjection()) {
        designType = Reflect.getMetadata("design:type", target, propKey);
        dependencyName = designType.name; // TODO
        // get property dependency name
      }

      if (result.isConstructorInjection()) {
        const dependencyParamIndex  = result.getConstructorIndex();
        const ctorParameterMetadata = getConstructorParameterMetadata(target.constructor, dependencyParamIndex);        

        designType = Reflect.getMetadata("design:paramtypes", target.constructor)[dependencyParamIndex];
        dependencyName = ctorParameterMetadata?.dependencyName ?? designType.name;
      }

      if (!designType) {
        throw new Exceptions.UnknowInjectionTypeException();
      }

      result.resolve(dependencyName, designType, true);

      if (!result.isResolved()) {
        throw new Exceptions.UnresolvedDependencyException(result);
      }

      return result.getValue();
    }
  })
}
