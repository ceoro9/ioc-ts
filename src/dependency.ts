import { ConstructorT }                    from './types';
import { Container }                       from './container';
import { createDependencyProxyObject }     from './proxy';
import { getConstructorParameterMetadata } from './decorators/constructor/metadata';

/**
 * Container dependency entity
 */
export class Dependency {

  private name?: string;
  private ctor?: ConstructorT;
  private readonly container: Container;
  private readonly constructorIndex?: number;
  private value?: any;

  public constructor(name: string | undefined,
                     ctor: ConstructorT | undefined,
                     container: Container,
                     constructorIndex?: number) {
    this.name = name;
    this.ctor = ctor;
    this.container = container;
    this.value = void 0;
    this.constructorIndex = constructorIndex;
  }

  public resolve(dependencyName: string, ctor: ConstructorT, isLookUpInContainer: boolean) {

    // set dependency data
    this
    .setConstructor(ctor)
    .setName(dependencyName);

    // look up in container
    if (isLookUpInContainer) {
      const value = this.container.getValue(dependencyName);
      if (!(value instanceof Dependency)) {
        this.setValue(value);
        return value;
      }
    }
    
    // base case
    if (ctor.length === 0) {
      const value = new ctor();
      this.setValue(value);
      this.container.setDependencyValue(dependencyName, value);
      return value;
    } 

    // init entity with dependecies
    const dependencies = []
    for (let paramIndex = 0; paramIndex < ctor.length; ++paramIndex) {

      const ctorParameterMetadata = getConstructorParameterMetadata(ctor, paramIndex);
      const dependency = new Dependency(
        ctorParameterMetadata?.dependencyName,
        void 0, // TODO: extract type constructor with design:paramtypes reflection
        ctorParameterMetadata?.container ?? this.container,
        paramIndex,
      );

      dependencies.push(dependency);
    }

    const result    = new ctor(...dependencies);
    const proxified = createDependencyProxyObject(result);

    this.setValue(proxified);
  }

  public isResolved() {
    return !!this.value;
  }

  public isPropertyInjection() {
    return this.getConstructorIndex() === void 0;
  }

  public isConstructorInjection() {
    return this.getConstructorIndex() !== void 0;
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

  public getConstructorIndex() {
    return this.constructorIndex;
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
