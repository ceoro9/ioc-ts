import * as Exceptions      from '../exceptions';
import * as Constants       from '../constants';
import { ConstructorT }     from '../types';
import { DependencyMember } from './member';


let defaultContainer: Container | undefined;


export class Container {

  /**
   * Container with all entities marked as injectable
   */
  public static getDefault() {
    if (!defaultContainer) {
      defaultContainer = new Container();
    }
    return defaultContainer;
  }

  private dependencyConstructors: { [name: string]: ConstructorT | undefined };
  private dependencyMembers:      { [name: string]: DependencyMember | undefined };

  public constructor() {
    this.dependencyConstructors = {};
    this.dependencyMembers      = {};
  }

  /**
   * Bind dependency
   */
  public bind(ctor: ConstructorT): void;
  public bind(name: string, ctor: ConstructorT): void;
  public bind(arg_1: any, arg_2?: any) {

    let ctor: ConstructorT, name: string;

    if (typeof arg_1 === 'function') {
      ctor = arg_1;
      name = ctor.name;
    }
    else {
      name = arg_1;
      ctor = arg_2; 
    }

    this.bindContainerReference(ctor);
    this.checkDependencyName(name);
    this.addDependecyConstructor(name, ctor);
    this.addDependencyValue(name, ctor);
  }

  /**
   * Get dependency constructor by name
   */
  public getConstructor(name: string) {
    return this.dependencyConstructors[name];
  }

  /**
   * Get dependency by name
   */
  public getValue(name: string): any;
  public getValue<T>(ctor: ConstructorT<T>): T;
  public getValue(obj: any) {

    let dependencyName: string;

    if (typeof obj === 'function') {
      dependencyName = obj.name;
    }
    else {
      dependencyName = obj;
    }

    const result = this.getDependencyMember(dependencyName);

    if (!result) {
      throw new Exceptions.UnknownDependencyException();
    }

    return result.getDependency();
  }

  public getDependencyMember(dependencyName: string) {
    return this.dependencyMembers[dependencyName];
  }

  public removeDependencyMember(dependencyName: string) {
    delete this.dependencyMembers[dependencyName];
  }

  /**
   * Remove dependency by name
   */
  public remove(dependencyName: string) {
    delete this.dependencyConstructors[dependencyName];
    this.removeDependencyMember(dependencyName);
  }

  /**
   * Checks if dependency with provided identifiers exists in container
   */
  private checkDependencyName(name: string) {
    if (this.dependencyConstructors[name]) {
      throw new Exceptions.DependecyAlreadyBindedException();
    }
  }

  private addDependecyConstructor(name: string, ctor: ConstructorT) {
    this.dependencyConstructors[name] = ctor;
  }

  /**
   * Saves container reference to constructor's prototype
   */
  private bindContainerReference(ctor: ConstructorT) {

    const ctorPrototype = ctor.prototype as any;

    if (ctorPrototype[Constants.InjectableContainerKey]) {
      throw new Exceptions.ContainerAlreadyBinded();
    }

    ctorPrototype[Constants.InjectableContainerKey] = this;
  }

  /**
   * Adds dependency value to container
   */
  public addDependencyValue(ctor: ConstructorT): void;
  public addDependencyValue(name: string, ctor: ConstructorT): void;
  public addDependencyValue(arg_1: any, arg_2?: any) {

    let ctor: ConstructorT, name: string;

    if (typeof arg_1 === 'function') {
      ctor = arg_1;
      name = ctor.name;
    }
    else {
      name = arg_1;
      ctor = arg_2;
    }

    this.dependencyMembers[name] = new DependencyMember(name, ctor, this);
  }

  /**
   * Sets dependency value
   */
  public setDependencyValue(name: string, value: any): void;
  public setDependencyValue(ctor: ConstructorT, value: any): void;
  public setDependencyValue(identifier: any, value: any) {

    let dependencyName: string;

    if (typeof identifier === 'string') {
      dependencyName = identifier;
    }
    else {
      dependencyName = identifier.name;
    }

    this.setDependencyValue(dependencyName, value);
  }

  public lookUpDependencyName(lookUpCtor: ConstructorT) {
    // TODO: make more pretty
    for (const dependencyName of Object.keys(this.dependencyConstructors)) {
      if (this.dependencyConstructors[dependencyName] === lookUpCtor) {
        return dependencyName;
      }
    }
    return void 0;
  }
}
