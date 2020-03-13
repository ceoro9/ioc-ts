import { ConstructorT } from '../types';
import { Container }    from './main';
import { Dependency }   from '../dependency';


/**
 * Unique injectable entity instance, 
 * that is stored in the container.
 */
export class ContainerEntity {

  private dependency: any;

  public constructor(private readonly name: string | undefined,
                     private readonly constructor: ConstructorT,
                     private readonly container: Container) {}

  public getDependency() {

    if (!this.dependency) {
      const value = Dependency.constructEntity(this.constructor, this.container);
      this.setDependency(value);
    }

    return this.dependency;
  }

  public getIdentifier() {
    return this.name ?? this.constructor.name;
  }

  public setDependency(newValue: any) {
    this.dependency = newValue;
    return this;
  }
}
