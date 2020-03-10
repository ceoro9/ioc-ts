import { Injectable, InjectProperty, Container } from '../src';


@Injectable
class Dependency_1 {

  public sayHello() {
    console.log('Hello_1');
  }
}


@Injectable
class Dependency_2 {

  public constructor(private readonly dep_1: Dependency_1) {
  }

  public sayHello() {
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

  @InjectProperty()
  public dep_1: Dependency_1;
  
  @InjectProperty()
  public dep_2: Dependency_2;

  @InjectProperty()
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
