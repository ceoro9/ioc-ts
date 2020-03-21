# Container API
This document describes container options and methods, that can be used to fully utilize all capabilities of IoC.

## Container initializtion
```ts
import { Container } from '@ceoro9/ioc-ts';

const container = new Container();
```

## Container methods

#### Container.bind
Adds new entity binding to the container by passing only entity class(name of entity will be used as binding name) or explicitly binding name and entity class.
```ts
public bind(ctor: ConstructorT): void;
public bind(bindingName: string, ctor: ConstructorT): void;
```

#### Container.get
Gets an instance of entity binding from container by associated name or entity class.
```ts
public get<T>(ctor: ConstructorT<T>): T;
public get(bindingName: string): any;
```

#### Container.set
Sets new entity binding instance by its name or entity class. Adds new, if does not exist.
```ts
public set<T>(ctor: ConstructorT<T>, newValue: T): void;
public set(bindingName: string, newValue: Record<string, any>): void;
 
```

#### Container.remove
Removes entity binding from container by its name or entity class.
```ts
public remove<T>(ctor: ConstructorT<T>): T;
public remove(bindingName: string): any;
```

#### Container.remove
Removes all entity bindings and their associated instances from container
```ts
public clear(): void;
```
