# Constructor injection
This document describes one of two main types of injection - constructor.

### Decorator injection

At first let's take a look on the brief example.
```ts
import { Inject, Injectable } from '@ceoro9/ioc-ts';

@Injectable()
class DatabaseService {}

@Injectable()
class AppController {

   public constructor(
     @Inject() private readonly databaseService: DatabaseService
   ) {}
}
```

There we have a `DatabaseService` that presents some database functionality. And a `AppController`, that depends on this database service and makes a constructor injection with `Inject` decorator to get a reference to the instance of database service.

Since binding name was not specified, type of constructor's parameter will be used as entity identifier(more specifically class name will be used as binding name, in our case this is `DatabaseService`). In that way IoC container will be able to resolve this `AppController`'s dependency and initialize it with the instance of `DatabaseService`.

You can also explicitly specify binding name, if it's different from parameter type or interface is used as a type, because interfaces don't exist in run-time, IoC will not be able to reflect parameter type to use it as an identifier.

```ts
@Injectable('POSTGRES_DATABASE_SERVICE')
class DatabaseService {}

@Injectable()
class AppController {

   public constructor(
     @Inject('POSTGRES_DATABASE_SERVICE') private readonly databaseService: DatabaseService
   ) {}
}
```

### Decoratorless injection

`ioc-ts` also supports decoratorless constructor injection, where you don't need to mark constructor's parameters with `Inject` decorator to make an injection works. This is more implicit approach to make an injection, which is basically an equivalent to the first example, where `Inject` decorator was used without parameters.

```ts
@Injectable()
class DatabaseService {}

@Injectable()
class AppController {

   public constructor(private readonly databaseService: DatabaseService) {}
}
```

And again since binding name was not specified, because we basically don't have a decorator, where we can do this. Type of constructor's parameter will be used as entity identifier. In that way IoC container will resolve `AppController`'s dependency and initialize it with the instance of `DatabaseService`.
