import * as Exceptions  from './exceptions';
import * as Constants   from './constants';
import { ConstructorT } from './types';
import { Dependency }   from './dependencies';


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
  private dependencyValues:       { [name: string]: Dependency | undefined };

  public constructor() {
    this.dependencyConstructors = {};
    this.dependencyValues       = {};
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

    let name: string;

    if (typeof obj === 'string') {
      name = obj;
    }
    else {
      name = obj.name;
    }

    const result = this.dependencyValues[name];

    if (!result) {
      throw new Exceptions.UnknownDependencyException();
    }

    if (result.isResolved()) { 
    }
    else {
      const designTypeCtor = this.getConstructor(name);

      if (!designTypeCtor) {
        throw new Exceptions.UnknownDependencyException();
      }

      result.resolve(name, designTypeCtor, false);

      if (!result.isResolved()) {
        throw new Exceptions.UnresolvedDependencyException(result);
      }
    }

    return result.getValue();
  }

  /**
   * Remove dependency by name
   */
  public remove(name: string) {
    delete this.dependencyConstructors[name];
    delete this.dependencyValues[name]; // TODO: call destructor
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

    this.dependencyValues[name] = new Dependency(name, ctor, this);
  }

  /**
   * Sets dependency value
   */
  public setDependencyValue(name: string, value: any): void;
  public setDependencyValue(ctor: ConstructorT, value: any): void;
  public setDependencyValue(identifier: any, value: any) {

    let name: string;

    if (typeof identifier === 'string') {
      name = identifier;
    }
    else {
      name = identifier.name;
    }

    const dependency = this.dependencyValues[name];

    if (!dependency) {
      throw new Exceptions.UnknownDependencyException();
    }

    dependency.setValue(value);  // resolve dependency
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
