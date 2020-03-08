import 'reflect-metadata';


const InjectableKey = Symbol('INJECTABLE');


class BaseDependecyException {}

class DependecyAlreadyBindedException extends BaseDependecyException {}

class UnknownDependencyException extends BaseDependecyException {}

class UnresolvedDependencyException extends BaseDependecyException {

  public constructor(public dependecy: Dependency) {
    super();
  }
}


type ConstructorT<R = any> = { new (...args: any[]): R };


function createDependencyProxyObject(proxifiedObject: any) {
  return new Proxy(proxifiedObject, {
    get(target: any, propKey: string) {

      console.log(`Get property: `, propKey);

      const result = Reflect.get(target, propKey);

      // not injectable property
      if (!(result instanceof Dependency)) {
        return result;
      }

      // check if property is resolved and return actual value
      if (result.isResolved()) {
        return result.getValue();
      }

      // try to resolve dependency if possible
      const designType = Reflect.getMetadata("design:type", target, propKey);

      console.log(`HERE: ${propKey} --- ${designType}`);

      result.resolve(designType, true);

      if (!result.isResolved()) {
        throw new UnresolvedDependencyException(result);
      }

      return result.getValue();
    }
  })
}

/**
 * Copies metadata from source to destination function
 * @param source
 * @param destination
 */
function copyFunctionMetadata(source: Function, destination: Function) {
  destination.prototype = source.prototype;
  Object.defineProperty(destination, 'name', {
    writable: false,
    value: source.name,
  });
  Object.defineProperty(destination, 'length', {
    writable: false,
    value: source.length,
  });
}


function Injectable(target: any) {

  // mark constructor as injectable
  target[InjectableKey] = true

  // save a reference to the original constructor
  const original = target;

  // a utility function to generate instances of a class
  function construct(ctor: any, args: any[]) {

    const innerCtor: any = function () {
      return new ctor(...args);
    }

    innerCtor.prototype = ctor.prototype;
    const result = new innerCtor();

    return createDependencyProxyObject(result);
  }

  // the new constructor behaviour
  const newCtor: any = function (...args: any) {
    return construct(original, args);
  }

  // copy metadata
  copyFunctionMetadata(original, newCtor);

  // return new constructor (will override original)
  return newCtor;
}


/**
 * Dependencies container
 */
class Container {

  private dependencyConstructors: {[name: string]: ConstructorT};
  private dependencyValues: {[name: string]: any};

  public constructor() {
    this.dependencyConstructors = {};
    this.dependencyValues = {}; 
  }

  /**
   * Bind dependency
   */
  public bind(ctor: ConstructorT): void;
  public bind(name: string, ctor: ConstructorT): void;
  public bind(arg_1: any, arg_2?: any) {

    let ctor: ConstructorT, name: string;

    // 1st overloaded case
    if (typeof arg_1 === 'function') {
      ctor = arg_1;
      name = ctor.name;
    }

    // 2nd overloaded case
    if (typeof arg_1 === 'string') {
      name = arg_1;
      ctor = arg_2; 
    }

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
  public getValue(ctor: ConstructorT): any;
  public getValue(obj: any) {

    let name;

    if (typeof obj === 'string') {
      name = obj;
    } else if (typeof obj === 'function') {
      name = obj.name;
    }

    const result = this.dependencyValues[name];

    if (!result) {
      throw new UnknownDependencyException();
    }

    // not yet resolved
    if (result instanceof Dependency) {

      // try to resolve
      const designTypeCtor = this.getConstructor(name);
      result.resolve(designTypeCtor, false);

      if (!result.isResolved()) {
        throw new UnresolvedDependencyException(result);
      }

      // save value
      const value = result.getValue();
      this.dependencyValues[name] = value;

      return value;
    }

    // already resolved
    return result;
  }

  /**
   * Remove dependency by name
   */
  public remove(name: string) {
    delete this.dependencyConstructors[name];
    delete this.dependencyValues[name]; // TODO: call destructor
  }

  private checkDependencyName(name: string) {
    if (this.dependencyConstructors[name]) {
      throw new DependecyAlreadyBindedException();
    }
  }

  private addDependecyConstructor(name: string, ctor: ConstructorT) {
    this.dependencyConstructors[name] = ctor;
  }

  /**
   * Adds dependency value to container
   */
  public addDependencyValue(ctor: ConstructorT): void;
  public addDependencyValue(name: string, ctor: ConstructorT): void;
  public addDependencyValue(arg_1: any, arg_2?: any) {

    let ctor, name;

    // 1st overloaded case
    if (typeof arg_1 === 'function') {
      ctor = arg_1;
      name = ctor.name;
    }

    // 2nd overloaded case
    if (typeof arg_1 === 'string') {
      name = arg_1;
      ctor = arg_2;
    }

    this.dependencyValues[name] = new Dependency(name, ctor, this);
  }

  /**
   * Replaces dependency with value
   */
  public setDependencyValue(name: string, value: any): void;
  public setDependencyValue(ctor: ConstructorT, value: any): void;
  public setDependencyValue(identifier: any, value: any) {

    let name: string;

    // 1st overloaded case
    if (typeof identifier === 'string') {
      name = identifier;
    }

    // 2nd overloaded case
    if (typeof identifier === 'function') {
      name = identifier.name;
    }

    if (!this.dependencyValues[name]) {
      throw new UnknownDependencyException();
    }

    this.dependencyValues[name] = value;
  }
}


/** 
 * Container dependency
 */
class Dependency {

  private name?: string;
  private ctor?: ConstructorT;
  private readonly container: Container;
  private value?: any;

  public constructor(name: string, ctor: ConstructorT, container: Container) {
    this.name = name;
    this.ctor = ctor;
    this.container = container;
    this.value = void 0;
  }

  public resolve(ctor: ConstructorT, isLookUpInContainer: boolean) {

    // set dependency data
    this
      .setConstructor(ctor)
      .setName(ctor.name);

    // look up in container
    if (isLookUpInContainer) {
      const value = this.container.getValue(ctor);
      if (!(value instanceof Dependency)) {
        this.setValue(value);
        return value;
      }
    }
    
    // base case
    if (ctor.length === 0) {
      const value = new ctor();
      this.setValue(value);
      this.container.setDependencyValue(ctor, value);
      return value;
    }

    // init entity with dependecies
    const dependencies = []
    for (let i = 0; i < ctor.length; ++i) {
      const dependency = new Dependency(void 0, void 0, this.container);
      dependencies.push(dependency);
    }

    const result = new ctor(...dependencies);
    const proxified = createDependencyProxyObject(result);

    this.setValue(proxified);
  }

  public isResolved() {
    return !!this.value;
  }

  public getConstructor() {
    return this.ctor;
  }

  public getName() {
    return this.name;
  }

  public getContainer() {
    return this.container;
  }

  public getValue() {
    return this.value;
  }

  public setValue(value: any) {
    this.value = value;
    return this;
  }

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setConstructor(ctor: ConstructorT) {
    this.ctor = ctor;
    return this;
  }
}


@Injectable
class Dependency_1 {

  public sayHello() {
    console.log('Hello_1');
  }
}


@Injectable
class Dependency_2 {

  public constructor(public dep_1: Dependency_1) {}

  public sayHello() {
    this.dep_1.sayHello();
    console.log('Hello_2');
  }
}


function main() {

  const container = new Container();

  container.bind(Dependency_1);
  container.bind(Dependency_2);

  const dep_2 = container.getValue(Dependency_2);

  console.log(dep_2);

  // TODO
  dep_2.sayHello();
}


main();
