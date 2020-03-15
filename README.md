# ioc-ts
TypeScript IoC container

# Installing
```sh
npm install https://github.com/ceoro9/ioc-ts
```

# Usage

Imports
```ts
import { Injectable, Inject, Container } from '@ceoro9/ioc-ts';
```


Define your entities and mark them with *Injectable* decorator
```ts
@Injectable()
class DependencyOne {
        
  public talk() {
    console.log(`Hello. I'm DependencyOne`);
  }
}


@Injectable()
class DependencyTwo {
    
  public talk() {
    console.log(`Hello. I'm DependencyTwo`);
  }
}
```

Then inject dependencies in the property with *Inject* decorator
```ts
@Injectable()
class DependencyThree {

  @Inject()
  private depOne: DependencyOne;
  
  public talk() {
    this.depOne.talk();    
  }
}
```

Or in the constructor
```ts
@Injectable()
class DependencyFour {
    
  public constructor(private readonly depTwo: DependencyTwo) {}
    
  public talk() {
    this.depTwo.talk();    
  }
}
```


Get global container, where all your injectable entities are stored
```ts
const container = Container.getGlobal();
```


So you're done. Now you can safely and comfortably work with all of your entities. IoC container will take care of resolving and initializing of their dependencies.
```ts
const depThree = container.get(DependencyThree);
const depFour  = container.get(DependencyFour);

depThree.talk();  // output: Hello. I'm DependencyOne
depFour.talk();   // output: Hello. I'm DependencyTwo
```

# License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) license.
