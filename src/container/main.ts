import * as Exceptions from '../exceptions';
import { ConstructorT } from '../types';
import { BaseEntity, SyncEntity, AsyncEntity, isAsyncEntity } from './entity';
import { AsyncInjectableInstance } from './types';
import { EntityDoesNotExistException } from '../exceptions';

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

  public entityBindings: { [name: string]: BaseEntity<any> | undefined };

  public constructor() {
    this.entityBindings = {};
  }

  /**
   * Adds a sync entity binding
   */
  public bind<T>(ctor: ConstructorT<T>): void;
  public bind<T>(bindingName: string, ctor: ConstructorT<T>): void;
  public bind<T>(identifier: ConstructorT | string, constructor?: ConstructorT<T>) {
    const { bindingName, ctor } = this.decodeEntityBindingIdentifier(identifier, constructor);

    if (this.getEntityBinding(bindingName)) {
      throw new Exceptions.EntityAlreadyBindedException();
    }

    this.addSyncEntityBinding(bindingName, ctor);
  }

  /**
   * Adds an async entity binding
   */
  public bindAsync<T extends AsyncInjectableInstance>(ctor: ConstructorT<T>): void;
  public bindAsync<T extends AsyncInjectableInstance>(bindingName: string, ctor: ConstructorT<T>): void;
  public bindAsync<T extends AsyncInjectableInstance>(
    identifier: ConstructorT<T> | string,
    constructor?: ConstructorT<T>,
  ) {
    const { bindingName, ctor } = this.decodeEntityBindingIdentifier(identifier, constructor);

    if (this.getEntityBinding(bindingName)) {
      throw new Exceptions.EntityAlreadyBindedException();
    }

    this.addAsyncEntityBinding(bindingName, ctor);
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

    return entity.getEntityValue();
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
      entity = this.addSyncEntityBinding(bindingName, ctor);
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

  public setUpEntities() {
    this.getEntities().forEach(entity => {
      if (isAsyncEntity(entity)) {
        throw new Error('Your container has an async entity.' + 'Use `setUpAsyncEntities` to setup container.');
      }

      return entity.getEntityValue();
    });
  }

  public async setUpAsyncEntities() {
    const entityValues = this.getEntities().map(entity => entity.getEntityValue());
    await Promise.all(entityValues);
  }

  private getEntities() {
    return Object.keys(this.entityBindings).map(bindingName => this.getEntityBindingStrict(bindingName));
  }

  private decodeEntityBindingIdentifier<T>(identifier: ConstructorT<T> | string, constructor?: ConstructorT<T>) {
    let bindingName: string, ctor: ConstructorT<T>;

    if (typeof identifier === 'string') {
      bindingName = identifier;
      ctor = constructor!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    } else {
      bindingName = identifier.name;
      ctor = identifier;
    }

    return { bindingName, ctor };
  }

  private addSyncEntityBinding(bindingName: string, ctor: ConstructorT) {
    const entity = new SyncEntity(bindingName, ctor, this);
    this.entityBindings[bindingName] = entity;
    return entity;
  }

  private addAsyncEntityBinding<T extends AsyncInjectableInstance>(bindingName: string, ctor: ConstructorT<T>) {
    const entity = new AsyncEntity(bindingName, ctor, this);
    this.entityBindings[bindingName] = entity;
    return entity;
  }

  public getEntityBinding(bindingName: string) {
    return this.entityBindings[bindingName];
  }

  public getEntityBindingStrict(bindingName: string) {
    const result = this.getEntityBinding(bindingName);
    if (!result) {
      throw new EntityDoesNotExistException();
    }
    return result;
  }

  public removeEntityBinding(bindingName: string) {
    delete this.entityBindings[bindingName];
  }
}
