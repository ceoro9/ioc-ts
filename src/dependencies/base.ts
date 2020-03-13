import { ConstructorT }                    from '../types';
import { Container }                       from '../container';
import { getConstructorParameterMetadata } from '../decorators/constructor/metadata';
import { ConstructorDependency }           from './constructor';


/**
 * Container dependency entity
 */
export class Dependency {

  private value?: any;

  public constructor(private name: string | undefined,
                     private ctor: ConstructorT,
                     private container: Container) {}

  public initDependencies() {
    const ctor = this.ctor;
    const dependencies = []
    
    for (let paramIndex = 0; paramIndex < ctor.length; ++paramIndex) {
      const ctorParameterMetadata = getConstructorParameterMetadata(this.ctor, paramIndex);
      const dependency = new ConstructorDependency(
        ctorParameterMetadata?.dependencyName,
        ctorParameterMetadata?.designType,
        ctorParameterMetadata?.container ?? this.container,
        paramIndex,
      );

      dependencies.push(dependency);
    }
    
    return dependencies;
  }

  public isResolved() {
    return this.value !== void 0;
  }

  public getConstructor() {
    return this.ctor;
  }

  public getName() {
    return this.name;
  }

  public getContainer() {
    return this.container;
  }

  public getValue() {
    return this.value;
  }

  public setValue(value: any) {
    this.value = value;
    return this;
  }

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setConstructor(ctor: ConstructorT) {
    this.ctor = ctor;
    return this;
  }
}

