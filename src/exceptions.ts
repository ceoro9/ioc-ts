import { Dependency } from './dependencies';


class BaseDependecyException {}

export class DependecyAlreadyBindedException extends BaseDependecyException {}

export class UnknownDependencyException extends BaseDependecyException {}

export class UnresolvedDependencyException extends BaseDependecyException {

  public constructor(public dependecy: Dependency) {
    super();
  }
}

export class InvalidDependencyIdentifier extends BaseDependecyException {}

export class ContainerNotBinded extends BaseDependecyException {}

export class ContainerAlreadyBinded extends BaseDependecyException {}

export class UnknowInjectionTypeException extends BaseDependecyException {}

export class NoConstructorMetadata extends BaseDependecyException {}
