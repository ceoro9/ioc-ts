import { ConstructorT } from '../types';
import { Container } from './main';
import { Dependency } from '../dependency';

/**
 * Entity with injectable instance value,
 * that is stored in the container.
 */
export class ContainerEntity<T = any> {
  private value: T;

  public constructor(
    private readonly name: string | undefined,
    private readonly constructor: ConstructorT<T>,
    private readonly container: Container,
  ) {}

  public getValue() {
    if (!this.value) {
      const value = Dependency.constructEntityInstance(this.constructor, this.container);
      this.setValue(value);
    }

    return this.value;
  }

  public getConstructor() {
    return this.constructor;
  }

  public getName() {
    return this.name;
  }

  public getIdentifier() {
    return this.getName() ?? this.getConstructor().name;
  }

  public setValue(newValue: any) {
    this.value = newValue;
    return this;
  }
}
