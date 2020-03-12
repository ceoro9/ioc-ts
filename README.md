# ioc-ts
TypeScript IoC container

# Installing
TODO: add package to npm registry
```
npm install https://github.com/ceoro9/ioc-ts
```

# Usage

Create container
```ts
import { Injectable, Inject, Container } from 'ioc-ts';

const container = new Container();
```

Define your injectable entities
```ts
@Injectable
class Dependency_1 {
        
  public talk() {
    console.log(`Hello. I'm Dependency_1`);
  }
}


@Injectable
class Dependency_2 {
    
  public talk() {
    console.log(`Hello. I'm Dependency_2`);
  }
}
```

Inject dependencies in the property
```ts
@Injectable
class Dependency_3 {

  @Inject()
  public dep_1: Dependency_1;
  
  public talk() {
    this.dep_1.talk();    
  }
}
```

Or in the constructor
```ts
@Injectable
class Dependency_4 {
    
  public constructor(public readonly dep_2: Dependency_2) {}
    
  public talk() {
    this.dep_2.talk();    
  }
}
```

Add entities to your container
```ts
container.bind(Dependency_1);
container.bind(Dependency_2);
container.bind(Dependency_3);
container.bind(Dependency_4);
```

Your're done. Now you can safely work with your entities, IoC container will take care of resolving and initializing of their dependencies.
```ts
const dep_3 = container.getValue(Dependency_3);
const dep_4 = container.getValue(Dependency_4);

dep_3.talk();  // output: Hello. I'm Dependency_1
dep_4.talk();  // output: Hello. I'm Dependency_2
```
