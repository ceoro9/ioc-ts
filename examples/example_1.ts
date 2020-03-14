import { Injectable, Inject, Container } from '../src';

@Injectable('Dependency_Zero')
class DependencyZero {
  public constructor() {
    console.log('DependencyZero::Constructor');
  }

  public sayHello() {
    console.log('Hello_0');
  }
}

@Injectable()
class DependencyOne {
  public sayHello() {
    console.log('Hello_1');
  }
}

@Injectable()
class DependencyTwo {
  public constructor(
    @Inject('Dependency_Zero') private readonly depZero: DependencyZero,
    private readonly depOne: DependencyOne,
  ) {}

  public sayHello() {
    console.log('--- START Dependency_2 ---');
    this.depZero.sayHello();
    this.depOne.sayHello();
    console.log('--- END Dependency_2 ---');
  }
}

@Injectable()
class A {
  public click() {
    console.log('CLICL FROM A');
  }
}

@Injectable()
class DependencyThree {
  @Inject('Dependency_Zero')
  public depZero: DependencyZero;

  @Inject()
  public depOne: DependencyOne;

  @Inject()
  public depTwo: DependencyTwo;

  @Inject()
  public nice: A;

  public sayBye() {
    console.log('--- START Dependency_3 ---');
    this.depZero.sayHello();
    this.depOne.sayHello();
    this.depTwo.sayHello();
    console.log('--- END Dependency_3 ---');
  }
}

function main() {
  const container = Container.getDefault();

  const depTwo = container.get(DependencyTwo);
  const depThree = container.get(DependencyThree);

  console.log('----- DEP_2 -----');
  depTwo.sayHello();

  console.log('----- DEP_3 ------');
  depThree.sayBye();
}

main();
