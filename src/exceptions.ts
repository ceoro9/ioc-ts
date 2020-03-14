import { Dependency } from './dependency';


class BaseEntityException {}

class BaseDependencyException {}

export class EntityAlreadyBindedException extends BaseEntityException {}

export class EntityDoesNotExistException extends BaseEntityException {}

export class UnknownDependencyException extends BaseDependencyException {}

export class UnresolvedDependencyException extends BaseDependencyException {

  public constructor(public dependecy: Dependency) {
    super();
  }
}

export class InvalidDependencyIdentifier extends BaseDependencyException {}

export class ContainerNotBinded extends BaseDependencyException {}

export class ContainerAlreadyBinded extends BaseDependencyException {}

export class UnknowInjectionTypeException extends BaseDependencyException {}

export class NoConstructorMetadata extends BaseDependencyException {}
