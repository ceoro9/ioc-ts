import 'reflect-metadata';


const InjectableKey = Symbol('INJECTABLE');


class BaseDependecyException {}


class DependecyAlreadBinded extends BaseDependecyException {}


class UnresolvedDependency extends BaseDependecyException {

  public constructor(public dependecy: Dependency) {
    super();
  }
}


type ConstructorT = { new (...args: any[]): any };


function createDependencyProxyObject(proxifiedObject: any) {
  return new Proxy(proxifiedObject, {
    get(target: any, propKey: string) {

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
      result.resolve(designType);

      if (!result.isResolved()) {
        throw new UnresolvedDependency(result);
      }

      return result.getValue();
    }
  })
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

  // copy prototype so intanceof operator still works
  newCtor.prototype = original.prototype;

  // return new constructor (will override original)
  return newCtor;
}


/**
 * Dependencies container
 */
class Container {

  private dependencyConstructors: {[name: string]: ConstructorT};
  private dependencyInstances: {[name: string]: Dependency};

  public constructor() {
    this.dependencyConstructors = {};
    this.dependencyInstances    = {}; 
  }

  /**
   * Bind dependency
   */
  public bind(name: string, ctor: ConstructorT) {
    this.checkDependencyName(name);
    this.addDependecy(name, ctor);
  }

  /**
   * Self-bind dependency
   */
  public selfBind(ctor: ConstructorT) {
    const dependencyName = ctor.name;
    this.checkDependencyName(dependencyName);
    this.addDependecy(dependencyName, ctor);
  }

  /**
   * Get dependency ctor by name
   */
  public getConstructor(name: string) {
    return this.dependencyConstructors[name];
  }

  /**
   * Get dependency by name
   */
  public getDependecy(name: string) {
    return this.dependencyInstances[name];
  }

  /**
   * Remove dependency by name
   */
  public remove(name: string) {
    delete this.dependencyConstructors[name];
    delete this.dependencyInstances[name]; // TODO: call destructor
  }

  private checkDependencyName(name: string) {
    if (this.dependencyConstructors[name]) {
      throw new DependecyAlreadBinded();
    }
  }

  private addDependecy(name: string, ctor: ConstructorT) {
    this.addDependecyConstructor(name, ctor);
    this.addDependecyInstance(name, ctor);
  }

  private addDependecyConstructor(name: string, ctor: ConstructorT) {
    this.dependencyConstructors[name] = ctor;
  }

  private addDependecyInstance(name: string, ctor: ConstructorT) {
    this.dependencyInstances[name] = new Dependency(name, ctor, this);
  }

}


/** 
 * Container dependency
 */
class Dependency {

  private name?: string;
  private ctor?: ConstructorT;
  private readonly container: Container;
  private value: any;

  public constructor(name: string, ctor: ConstructorT, container: Container) {
    this.name = name;
    this.ctor = ctor;
    this.container = container;
    this.value = void 0;
  }

  public resolve(ctor: ConstructorT) {

    // look up in container
    const dependency = this.container.getDependecy(ctor.name);

    if (dependency && dependency.isResolved()) {
      const value = dependency.getValue();
      this.setValue(value);
      return value;
    }


    // we got entity with zero dependencies
    if (ctor.length == 0) {

      const value = new ctor();

      if (!dependency.isResolved()) {
        dependency
          .setValue(value)
          .setConstructor(ctor)
          .setName(ctor.name);
      }
 
      return value;
    }

    // init entity with dependecies
    const dependencies = []
    for (let i = 0; i < ctor.length; ++i) {
      const dependency = new Dependency(void 0, void 0, this.container);
      dependencies.push(dependency);
    }

    const result = new ctor(...dependencies);

    return createDependencyProxyObject(result);
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


new Container();


@Injectable
class CustomMap {

  public constructor(private name: string) {}

  public sayHello() {
    console.log(this.name);
  }

}


const map = new CustomMap('Roman');
map.sayHello();
