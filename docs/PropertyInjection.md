# Property injection
This document describes one of two main types of injection - property.

### Decorator injection

And again, at first let's take a look on the example with database service and app's controller.

```ts
import { Inject, Injectable } from '@ceoro9/ioc-ts';

@Injectable()
class DatabaseService {}

@Injectable()
class AppController {

  @Inject()
  private readonly databaseService: DatabaseService;
}
```

Here is an app's controller, which has a readonly `databaseService` property. We mark it with `Inject` decorator. In the way IoC container will know, that he is responsible for resolving and initializing dependency for this property.

The mechanism of resolving dependency by type is absolutely the same as in the constructor injection. Please reference [constructor injection](./ConstructorInjection.md) section of documentation to find out more.

And here is one more example with property injection, where binding name is specified explicitly. Again, mechanism is absolutely the same as in the constructor injection.

```ts
@Injectable('POSTGRES_DATABASE_SERVICE')
class DatabaseService {}

@Injectable()
class AppController {

  @Inject('POSTGRES_DATABASE_SERVICE')
  private readonly databaseService: DatabaseService 
}
```

### Decoratorless injection

Unfortunately, there is no way to use decoratorless property injection. Because in that way IoC container just won't know which properties he is responsible for. So always use `Inject` decorator with property injection. 
