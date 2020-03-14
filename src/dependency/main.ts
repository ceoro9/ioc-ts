import { ConstructorT }                     from '../types';
import { Container }                        from '../container';
import { createDependencyProxyObject }      from '../proxy';
import { initConstructorParamDependencies } from './others';


/**
 * Dependency, that is passed to the real injectable entities on their construction
 */
export class Dependency<T = any> {
  
  private value?: T;

  public constructor(private readonly name: string | undefined,
                     private readonly constructor: ConstructorT<T>,
                     private readonly container: Container,
                     private readonly paramIndex: number) {}

  /**
   * Constructs new entity instance, using provided constructor.
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

  public getName() {
    return this.name;
  }

  public getConstructor() {
    return this.constructor;
  }

  public getContainer() {
    return this.container;
  }

  public getParamIndex() {
    return this.paramIndex;
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
