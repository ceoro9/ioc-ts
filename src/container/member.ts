import { ConstructorT }                from '../types';
import { Container }                   from './base';
import { createDependencyProxyObject } from '../proxy';
import { Dependency }                  from '../dependency';

export class DependencyMember {

  private dependency: any;

  public constructor(private readonly name: string | undefined,
                     private readonly ctor: ConstructorT,
                     private readonly container: Container) {}

  public getDependency() {

    if (!this.dependency) {
      const ctor         = this.ctor;
      const dependencies = Dependency.initConstructorDependencies(ctor, this.container);
      const result       = new ctor(...dependencies);
      this.dependency    = createDependencyProxyObject(result);
    }

    return this.dependency;
  }

  public setDependency(newValue: any) {
    this.dependency = newValue;
    return this;
  }

  public getIdentifier() {
    return this.name ?? this.ctor.name;
  }
}