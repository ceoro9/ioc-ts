# Global Container

As it was shown earlier to declare an entity you should mark your class with `Injectable` decorator. In that way you're telling `ioc-ts`, that this class is an entity, which lifecycle should be managed by IoC container. 

```ts
import { Injectable } from '@ceoro9/ioc-ts';

@Injectable()
class MyEntityOne {
  // ...
}
```

And by default all classes, marked with `Injectable` decorator will be binded to global container with their class name, unless entity name is specified explicitly in the first parameter of decorator.

```ts
@Injectable('MY_INJECTABLE_ENTITY_TWO')
class MyEntityTwo {
  // ...
}
```

To get a reference to the global container, where all your entities are stored, you should use static method of `Container` class.

```ts
import { Container } from '@ceoro9/ioc-ts';

const globalContainer = Container.getGlobal();
```

And now you can use all methods of container, that were described in [container api section](./ContainerAPI.md) of documentation, to safely and comfortably work with all of your declared entities.

```ts
const myEntityOne: MyEntityOne = globalContainer.get(MyEntityOne);
const myEntityTwo: MyEntityTwo = globalContainer.get('MY_INJECTABLE_ENTITY_TWO');
```
