import * as Exceptions     from '../exceptions';
import * as Constants      from '../constants';
import { ConstructorT }    from '../types';
import { ContainerEntity } from './entity';


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

  private constructors: { [name: string]: ConstructorT | undefined };
  private entities:     { [name: string]: ContainerEntity | undefined };

  public constructor() {
    this.constructors = {};
    this.entities     = {};
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
    return this.constructors[name];
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

    const result = this.getEntity(dependencyName);

    if (!result) {
      throw new Exceptions.UnknownDependencyException();
    }

    return result.getDependency();
  }

  public getEntity(dependencyName: string) {
    return this.entities[dependencyName];
  }

  public removeEntity(dependencyName: string) {
    delete this.entities[dependencyName];
  }

  /**
   * Remove dependency by name
   */
  public remove(dependencyName: string) {
    delete this.constructors[dependencyName];
    this.removeEntity(dependencyName);
  }

  /**
   * Checks if dependency with provided identifiers exists in container
   */
  private checkDependencyName(name: string) {
    if (this.getConstructor(name)) {
      throw new Exceptions.DependecyAlreadyBindedException();
    }
  }

  private addDependecyConstructor(name: string, ctor: ConstructorT) {
    this.constructors[name] = ctor;
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

    this.entities[name] = new ContainerEntity(name, ctor, this);
  }
}
