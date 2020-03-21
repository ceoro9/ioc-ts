# Custom container
This section describes, how to create and work with custom container.

As it was discussed in the [global container](./GlobalContainer.md) section. All entities, marked with `Injectable` decorator are automatically added to the global container. So in the most real-world cases it's enough to have just a global container and work with it. But sometimes you need to create a custom container. And of course you can do this in the imperative way, as it was shown in the [Container API](./ContainerAPI.md) section.

```ts
import { Container } from '@ceoro9/ioc-ts';

const customContainer = new Container();

customContainer.bind(...);
customContainer.bind(...);

// ...
```

But that's not really convenient. It would be more preferable to use decorators, as we were doing with global container. This is more clean and declarative approach to add our entities to the IoC container. And `Injectable` and `Inject` decorators give as such possibility. If we take a look on their signature.

```ts
function Injectable(dependencyName?: string, container?: Container);

function Inject(bindingName?: string, container?: Container);
```

We can see that there is a possibility to specify a container in the second parameter. If we specify it in the `Injectable` decorator, decorated entity will be added to the specified container. And if we specify it in the `Inject` decorator, dependency will be obtained from the specified container.

That's it! This is how we can work with custom container in the same way as we're doing with the global one.

And for more convenience we need to write some helper functions, that are basically wrappers around `ioc-ts` decorators to make them use our custom container.

This is how they look like.

```ts
import { Inject, Injectable, Container } from 'ioc-ts';

const customContainer = new Container();

const CustomInjectable = (entityName?: string) => {
  return Injectable(entityName, customContainer);
}

const CustomInject = (entityName?: string) => {
  return Inject(entityName, customContainer);
}
```

And their usage is not really different from the usage of regular `ioc-ts` decorators. The only difference, that now entities will be binded and resolved against our custom container.

```ts
@CustomInjectable()
class DatabaseService {}

@CustomInjectable()
class AppController {

   public constructor(
     @CustomInject() private readonly databaseService: DatabaseService
   ) {}
}
```
