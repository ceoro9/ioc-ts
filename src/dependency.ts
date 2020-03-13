import { ConstructorT }                    from './types';
import { Container }                       from './container';
import { createDependencyProxyObject }     from './proxy';
import { getConstructorParameterMetadata } from './decorators/constructor/metadata';


export class Dependency  {
  
  private value?: any;

  public constructor(private readonly name: string | undefined,
                     private readonly ctor: ConstructorT,
                     private readonly container: Container,
                     private readonly paramIndex: number) {}

  public static initConstructorDependencies(ctor: ConstructorT, container: Container) {
    const dependencies = []
    
    for (let paramIndex = 0; paramIndex < ctor.length; ++paramIndex) {
      const ctorParameterMetadata = getConstructorParameterMetadata(ctor, paramIndex);
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

  public resolve() {

    if (!this.value) {
      const container = this.container;
      const ctor      = this.ctor;
      const deps      = Dependency.initConstructorDependencies(ctor, container);
      const result    = new ctor(...deps);
      const proxified = createDependencyProxyObject(result);
      this.setValue(proxified);
    }

    return this.value;
  }

  public getParamIndex() {
    return this.paramIndex;
  }

  public getContainer() {
    return this.container;
  }

  public getName() {
    return this.name;
  }

  public getValue() {
    return this.value;
  }

  protected setValue(newValue: any) {
    this.value = newValue;
    return this;
  }
}
