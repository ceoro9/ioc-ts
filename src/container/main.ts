import * as Exceptions from '../exceptions';
import { ConstructorT } from '../types';
import { Entity } from './entity';

let globalContainer: Container | undefined;

export class Container {
  /**
   * Container with all entities marked as injectable
   */
  public static getGlobal() {
    if (!globalContainer) {
      globalContainer = new Container();
    }
    return globalContainer;
  }

  private entityBindings: { [name: string]: Entity | undefined };

  public constructor() {
    this.entityBindings = {};
  }

  /**
   * Adds an entity binding
   */
  public bind(ctor: ConstructorT): void;
  public bind(bindingName: string, ctor: ConstructorT): void;
  public bind(identifier: ConstructorT | string, constructor?: ConstructorT) {
    const { bindingName, ctor } = this.decodeEntityBindingIdentifier(identifier, constructor);

    if (this.getEntityBinding(bindingName)) {
      throw new Exceptions.EntityAlreadyBindedException();
    }

    this.addEntityBinding(bindingName, ctor);
  }

  /**
   * Gets an instance of entity binding
   */
  public get<T>(ctor: ConstructorT<T>): T;
  public get(bindingName: string): any;
  public get(identifier: ConstructorT | string) {
    const { bindingName } = this.decodeEntityBindingIdentifier(identifier);
    const entity = this.getEntityBinding(bindingName);

    if (!entity) {
      throw new Exceptions.UnknownDependencyException();
    }

    return entity.getValue();
  }

  /**
   * Sets a new entity binding instance(adds new, if does not exist)
   */
  public set<T extends Record<string, any>>(ctor: ConstructorT<T>, newValue: T): void;
  public set(bindingName: string, newValue: Record<string, any>): void;
  public set<T extends Record<string, any>>(identifier: ConstructorT<T> | string, newValue: T) {
    const { bindingName } = this.decodeEntityBindingIdentifier(identifier);
    let entity = this.getEntityBinding(bindingName);

    if (!entity) {
      const ctor = typeof identifier === 'function' ? identifier : (newValue.constructor as ConstructorT);
      entity = this.addEntityBinding(bindingName, ctor);
    }

    entity.setValue(newValue);
  }

  /**
   * Removes an entity binding
   */
  public remove<T>(ctor: ConstructorT<T>): T;
  public remove(bindingName: string): any;
  public remove(identifier: ConstructorT | string) {
    const { bindingName } = this.decodeEntityBindingIdentifier(identifier);

    if (!this.getEntityBinding(bindingName)) {
      throw new Exceptions.EntityDoesNotExistException();
    }

    this.removeEntityBinding(bindingName);
  }

  /**
   * Removes all entity bindins
   */
  public clear() {
    Object.keys(this.entityBindings).forEach(bindingName => this.removeEntityBinding(bindingName));
  }

  private decodeEntityBindingIdentifier(identifier: ConstructorT | string, constructor?: ConstructorT) {
    let bindingName: string, ctor: ConstructorT;

    if (typeof identifier === 'string') {
      bindingName = identifier;
      ctor = constructor!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    } else {
      bindingName = identifier.name;
      ctor = identifier;
    }

    return { bindingName, ctor };
  }

  private addEntityBinding(bindingName: string, ctor: ConstructorT) {
    const entity = new Entity(bindingName, ctor, this);
    this.entityBindings[bindingName] = entity;
    return entity;
  }

  public getEntityBinding(bindingName: string) {
    return this.entityBindings[bindingName];
  }

  public removeEntityBinding(bindingName: string) {
    delete this.entityBindings[bindingName];
  }
}
