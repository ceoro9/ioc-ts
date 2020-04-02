import { ConstructorT } from '../types';
import { Container } from './main';
import { Dependency } from '../dependency';
import { AsyncInjectableInstance } from './types';

/**
 * Base entity, which store an entity instance value or its promise
 */
export abstract class BaseEntity<T> {
  private value: T;

  public constructor(
    private readonly name: string | undefined,
    private readonly constructor: ConstructorT<T>,
    private readonly container: Container,
  ) {}

  abstract getEntityValue(): T | Promise<T>;

  public getConstructor() {
    return this.constructor;
  }

  public getName() {
    return this.name;
  }

  public getIdentifier() {
    return this.getName() ?? this.getConstructor().name;
  }

  public getContainer() {
    return this.container;
  }

  public getValue() {
    return this.value;
  }

  public setValue(newValue: any) {
    this.value = newValue;
    return this;
  }
}

/**
 * Entity, that stores a sync injectable entity instance
 */
export class SyncEntity<T = any> extends BaseEntity<T> {
  public getEntityValue() {
    const ctor = this.getConstructor();
    const container = this.getContainer();
    let value = this.getValue();

    if (!value) {
      value = Dependency.constructEntityInstance(ctor, container);
      this.setValue(value);
    }

    return value;
  }
}

/**
 * Entity, that stores an async injectable entity instance
 */
export class AsyncEntity<T extends AsyncInjectableInstance> extends BaseEntity<T> {
  public async getEntityValue() {
    const ctor = this.getConstructor();
    const container = this.getContainer();
    let value = this.getValue();

    if (!value) {
      value = Dependency.constructEntityInstance(ctor, container);
      await value.setUp();
      this.setValue(value);
    }

    return value;
  }
}

export function isSyncEntity(entity: BaseEntity<any>) {
  return entity instanceof SyncEntity;
}

export function isAsyncEntity(entity: BaseEntity<any>) {
  return entity instanceof AsyncEntity;
}
