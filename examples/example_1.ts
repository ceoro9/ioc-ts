import { Injectable, Inject, Container } from '../src';


@Injectable
class Dependency_0 {

  public sayHello() {
      console.log('Hello_0');
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

  public constructor(@Inject('Dependency_Zero') private readonly dep_0: Dependency_0,
                     @Inject() private readonly dep_1: Dependency_1) {}

  public sayHello() {
    this.dep_0.sayHello();
    this.dep_1.sayHello();
    console.log('Hello_2');
  }
}



@Injectable
class A {
  public click() {
    console.log('CLICL FROM A');
  }
}


@Injectable
class Dependency_3 {

  @Inject()
  public dep_1: Dependency_1;
  
  @Inject()
  public dep_2: Dependency_2;

  @Inject()
  public nice: A;

  public sayBye() {
    console.log('--- START Dependency_3 ---');
    this.dep_1.sayHello();
    this.dep_2.sayHello();
    console.log('--- END Dependency_3 ---');
  }
}


function main() {

  const container = new Container();

  container.bind(A);
  container.bind('Dependency_Zero', Dependency_0);
  container.bind(Dependency_1);
  container.bind(Dependency_2);
  container.bind(Dependency_3);

  const dep_2 = container.getValue(Dependency_2);
  const dep_3 = container.getValue(Dependency_3);
  
  console.log('----- DEP_2 -----');
  dep_2.sayHello();

  console.log('----- DEP_3 ------');
  dep_3.sayBye();
}


main();
