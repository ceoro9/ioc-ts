import { ConstructorT }                     from '../types';
import { Container }                        from '../container';
import { createDependencyProxyObject }      from '../proxy';
import { initConstructorParamDependencies } from './others';


export class Dependency  {
  
  private value?: any;

  public constructor(private readonly name: string | undefined,
                     private readonly constructor: ConstructorT,
                     private readonly container: Container,
                     private readonly paramIndex: number) {}

  /**
   * Constructs new entity, using provided constructor.
   * Passes dependencies with reflected metadata to constructor's parameters.
   * @param ctor
   * @param container
   */
  public static constructEntity(ctor: ConstructorT, container: Container) {    
    const deps   = initConstructorParamDependencies(ctor, container);
    const result = new ctor(...deps);
    return createDependencyProxyObject(result);
  }

  public resolve() {

    if (!this.value) {
      const value = Dependency.constructEntity(this.constructor, this.container);
      this.setValue(value);
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

  public getConstructor() {
    return this.constructor;
  }

  public getValue() {
    return this.value;
  }

  public getIdentifier() {
    return this.getName() ?? this.getConstructor().name;
  }

  protected setValue(newValue: any) {
    this.value = newValue;
    return this;
  }
}
