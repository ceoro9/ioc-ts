import * as Exceptions from '../exceptions';
import { ConstructorT } from '../types';
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

  private entities: { [entityName: string]: ContainerEntity | undefined };

  public constructor() {
    this.entities = {};
  }

  /**
   * Add entity to container
   */
  public bind(ctor: ConstructorT): void;
  public bind(name: string, ctor: ConstructorT): void;
  public bind(identifier: ConstructorT | string, constructor?: ConstructorT) {
    const { entityName, ctor } = this.decodeEntityIdentifier(identifier, constructor);

    if (this.getEntity(entityName)) {
      throw new Exceptions.EntityAlreadyBindedException();
    }

    this.addEntity(entityName, ctor);
  }

  /**
   * Gets entity instance from container
   */
  public get<T>(ctor: ConstructorT<T>): T;
  public get(entityName: string): any;
  public get(identifier: ConstructorT | string) {
    const { entityName } = this.decodeEntityIdentifier(identifier);
    const entity = this.getEntity(entityName);

    if (!entity) {
      throw new Exceptions.UnknownDependencyException();
    }

    return entity.getValue();
  }

  /**
   * Sets entity value(adds new, if does not exist)
   */
  public set<T extends Record<string, any>>(ctor: ConstructorT<T>, newValue: T): void;
  public set(entityName: string, newValue: Record<string, any>): void;
  public set<T extends Record<string, any>>(identifier: ConstructorT<T> | string, newValue: T) {
    const { entityName } = this.decodeEntityIdentifier(identifier);
    let entity = this.getEntity(entityName);

    if (!entity) {
      const ctor = typeof identifier === 'function' ? identifier : (newValue.constructor as ConstructorT);
      entity = this.addEntity(entityName, ctor);
    }

    entity.setValue(newValue);
  }

  /**
   * Removes entity from container
   */
  public remove<T>(ctor: ConstructorT<T>): T;
  public remove(entityName: string): any;
  public remove(identifier: ConstructorT | string) {
    const { entityName } = this.decodeEntityIdentifier(identifier);

    if (!this.getEntity(entityName)) {
      throw new Exceptions.EntityDoesNotExistException();
    }

    this.removeEntity(entityName);
  }

  /**
   * Removes all entities
   */
  public clear() {
    Object.keys(this.entities).forEach(entityName => this.removeEntity(entityName));
  }

  private decodeEntityIdentifier(identifier: ConstructorT | string, constructor?: ConstructorT) {
    let entityName: string, ctor: ConstructorT;

    if (typeof identifier === 'string') {
      entityName = identifier;
      ctor = constructor!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    } else {
      entityName = identifier.name;
      ctor = identifier;
    }

    return { entityName, ctor };
  }

  private addEntity(entityName: string, ctor: ConstructorT) {
    const entity = new ContainerEntity(entityName, ctor, this);
    this.entities[entityName] = entity;
    return entity;
  }

  public getEntity(entityName: string) {
    return this.entities[entityName];
  }

  public removeEntity(entityName: string) {
    delete this.entities[entityName];
  }
}
