import { ConstructorT }                    from '../types';
import { Container }                       from '../container';
import { Dependency }                      from './main';
import { getConstructorParameterMetadata } from '../decorators/constructor/metadata';


/**
 * Creates array of dependencies(with reflected metadata),
 * that could be passed as parameters to provided constructor.
 * @param ctor
 * @param container
 */
export function constructEntityConstructorDependencies(entityCtor: ConstructorT, container: Container) {
  const dependencies = []
  
  for (let paramIndex = 0; paramIndex < entityCtor.length; ++paramIndex) {
    const ctorParameterMetadata = getConstructorParameterMetadata(entityCtor, paramIndex);
    const dependency = new Dependency(
      ctorParameterMetadata?.dependencyName,
      ctorParameterMetadata?.designType,
      ctorParameterMetadata?.container ?? container,
      paramIndex,
    );

    dependencies.push(dependency);
  }
  
  return dependencies;
}
