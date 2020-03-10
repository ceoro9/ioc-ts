import { ConstructorT }                from './types';
import { Container }                   from './container';
import { createDependencyProxyObject } from './proxy';

/**
 * Container dependency entity
 */
export class Dependency {

  private name?: string;
  private ctor?: ConstructorT;
  private readonly container: Container;
  private readonly constructorIndex: number;
  private value?: any;

  public constructor(name: string,
                     ctor: ConstructorT,
                     container: Container,
                     constructorIndex?: number) {
    this.name = name;
    this.ctor = ctor;
    this.container = container;
    this.value = void 0;
    this.constructorIndex = constructorIndex;
  }

  public resolve(ctor: ConstructorT, isLookUpInContainer: boolean) {

    // set dependency data
    this
      .setConstructor(ctor)
      .setName(ctor.name);

    // look up in container
    if (isLookUpInContainer) {
      const value = this.container.getValue(ctor);
      if (!(value instanceof Dependency)) {
        this.setValue(value);
        return value;
      }
    }
    
    // base case
    if (ctor.length === 0) {
      const value = new ctor();
      this.setValue(value);
      this.container.setDependencyValue(ctor, value);
      return value;
    } 

    // init entity with dependecies
    const dependencies = []
    for (let i = 0; i < ctor.length; ++i) {
      const dependency = new Dependency(void 0, void 0, this.container, i);
      dependencies.push(dependency);
    }

    const result = new ctor(...dependencies);
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
