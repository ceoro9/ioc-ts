import 'reflect-metadata';
import { Injectable, Inject, Container } from '../src';

interface IPerson {
  id: string;
  firstName: string;
  lastName: string;
}

interface IPersonService {
  createPerson(person: Omit<IPerson, 'id'>): IPerson;
  getPersonById(personId: string): IPerson | undefined;
}

const PERSON_POSTGRES_SERVICE_NAME = 'PERSON_POSTGRES_SERVICE';
const PERSON_MONGO_SERVICE_NAME = 'PERSON_MONGO_SERVICE';

/* eslint-disable @typescript-eslint/no-unused-vars */

@Injectable(PERSON_POSTGRES_SERVICE_NAME)
class PersonPostgresService implements IPersonService {
  private readonly db: { [id: string]: IPerson | undefined };

  public constructor() {
    this.db = {};
  }

  public createPerson(person: IPerson) {
    const personId = Math.random()
      .toString(36)
      .substring(7);
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
    const personId = Math.random()
      .toString(36)
      .substring(10);
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

@Injectable()
class PersonController {
  @Inject(PERSON_POSTGRES_SERVICE_NAME)
  private personService: IPersonService;

  public get(personId: string) {
    const person = this.personService.getPersonById(personId);
    return person ? { status: 200, data: person } : { status: 404, data: null };
  }

  public post(personData: Omit<IPerson, 'id'>) {
    const person = this.personService.createPerson(personData);
    return {
      status: 201,
      data: person,
    };
  }
}

function main() {
  const container = Container.getGlobal();
  const personController = container.get(PersonController);

  const {
    data: { id: personId },
  } = personController.post({
    firstName: 'firstName0',
    lastName: 'lastName0',
  });
  console.log(personController.get(personId));
}

main();
