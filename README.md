# ioc-ts

[![Build Status](https://travis-ci.org/ceoro9/ioc-ts.svg?branch=master)](https://travis-ci.org/ceoro9/ioc-ts) [![Coverage Status](https://coveralls.io/repos/github/ceoro9/ioc-ts/badge.svg?branch=chore/tests)](https://coveralls.io/github/ceoro9/ioc-ts?branch=chore/tests)

Inversion of control container on TypeScript

# Installing
```sh
npm install @ceoro9/ioc-ts reflect-metadata --save
```

# About
`ioc-ts` is an implementation of inversion on control (IoC) container on TypeScript, that encourages declarational approarch, using decorators and reflection to comfortably and transperrently manage entities and their dependencies.

# Usage
This short example just shows the basics, what `ioc-ts` container is really capable of. Please check out documetation, that will be avaiable soon, to find out more about more sophisticated functionality `ioc-ts` can offer you.

### Step 0: Configure TypeScript compiler
```json
{
  "compilerOptions": {
    ...
    "types": ["reflect-metadata"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Step 1: Imports
```ts
import 'reflect-metadata';
import { Injectable, Inject, Container } from '@ceoro9/ioc-ts';
```


### Step 2: Declare your data types and service interfaces
```ts
interface IPerson {
  id:        string;
  firstName: string;
  lastName:  string;
}

interface IPersonService {
  createPerson(person: Omit<IPerson, 'id'>): IPerson;
  getPersonById(personId: string): IPerson | undefined;
}
```

### Step 3: Declare your injectable entities, which implement the above service interface
In our example we have two services, which implement `IPersonService` interface. The first one is PostgreSQL service and second one is MongoDB. Each one corresponds to the database, that it uses under the hood.
```ts
const PERSON_POSTGRES_SERVICE_NAME = 'PERSON_POSTGRES_SERVICE';
const PERSON_MONGO_SERVICE_NAME    = 'PERSON_MONGO_SERVICE';

@Injectable(PERSON_POSTGRES_SERVICE_NAME)
class PersonPostgresService implements IPersonService {

  private readonly db: { [id: string]: IPerson | undefined };

  public constructor() {
    this.db = {};
  }

  public createPerson(person: IPerson) {
    const personId = Math.random().toString(36).substring(7);
    this.db[personId] = person;
    return {
      ...person,
      id: personId,
    };
  }

  public getPersonById(personId: string) {
    return this.db[personId];
  }
}

@Injectable(PERSON_MONGO_SERVICE_NAME)
class PersonMongoService implements IPersonService {

  private readonly db: Map<string, IPerson>;

  public constructor() {
    this.db = new Map();
  }

  public createPerson(person: IPerson) {
    const personId = Math.random().toString(36).substring(10);
    this.db.set(personId, person);
    return {
      ...person,
      id: personId,
    };
  }

  public getPersonById(personId: string) {
    return this.db.get(personId);
  }
}
```

### Step 4: Make an injection
And now we have a person controller, which wants to use some service to persist data, but don't want to know implementation details of how this data is persisted and stored. In other words, our person controller should depend upon service interface, but not its concrete implementation. That's why the type of `personService` property is `IPersonService` interface. But anyway, we should specify which concrete implementation of service interface `personService` should take from container. This is where we should make an injection by specifying entity name, which our controller should use. In our case this is property injection by `PERSON_POSTGRES_SERVICE_NAME` identifier. So in fact, our service will use PostgreSQL service to persist data, but it has no idea about this.
```ts
@Injectable()
class PersonController {

  @Inject(PERSON_POSTGRES_SERVICE_NAME)
  private personService: IPersonService;
  
  public get(personId: string) {
    const person = this.personService.getPersonById(personId);
    return (
      person
      ? { status: 200, data: person }
      : { status: 404, data: null }
    );
  }

  public post(personData: Omit<IPerson, 'id'>) {
    const person = this.personService.createPerson(personData);
    return {
      status: 201,
      data: person,
    };
  }
}
```

### Step 5: Obtain reference to global container, where all your injectable entities are stored by default
```ts
const container = Container.getGlobal();
```

### Step 6: Get your entities with their resolved dependencies
So you're done. Now you can safely and comfortably work with all of your entities. IoC container will take care of resolving and initializing of their dependencies.
```ts
const personController = container.get(PersonController);

const { data: { id: personId } } = personController.post({
  firstName: 'firstName0',
  lastName: 'lastName0',
}); // { status: 201, data: { ... } }
personController.get(personId); // { status: 200, data: { ... } }
```

# License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) license.
