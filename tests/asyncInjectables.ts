import { AsyncInjectalble, Container, AsyncInjectableEntity } from '../src';

describe('Injectable entities presence', () => {

  const customContainer = new Container();

  const CustomAsyncInjectable = (entityName?: string) => {
    return AsyncInjectalble(entityName, customContainer);
  };

  beforeEach(() => {
    // remove all entities from custom and global container
    customContainer.clear();
    Container.getGlobal().clear();
  });

  test('Container::setUpAsyncEntities - test get method', async () => {

    const FIRST_VALUE = 10;
    const SECOND_VALUE = 20;

    @CustomAsyncInjectable()
    class DependencyOne implements AsyncInjectableEntity {

      public value?: number;

      public async setUp() {
        await new Promise((resolve) => {
          this.value = FIRST_VALUE;
          resolve(void 0);
        });
      }
    }

    @CustomAsyncInjectable()
    class DependencyTwo implements AsyncInjectableEntity {

      public value?: number;

      public async setUp() {
        await new Promise((resolve) => {
          this.value = SECOND_VALUE;
          resolve(void 0);
        });
      }
    }

    // async dependencies are not yet resolved
    {
      const depOne = customContainer.get(DependencyOne);
      const depTwo = customContainer.get(DependencyTwo);
  
      expect(depOne).toBeDefined();
      expect(depTwo).toBeDefined();
  
      expect(depOne).toBeInstanceOf(Promise);
      expect(depTwo).toBeInstanceOf(Promise);
    }

    await customContainer.setUpAsyncEntities();

    // all async dependencies are now resolved
    {
      const depOne = customContainer.get(DependencyOne);
      const depTwo = customContainer.get(DependencyTwo);

      expect(depOne).toBeInstanceOf(DependencyOne);
      expect(depTwo).toBeInstanceOf(DependencyTwo);
  
      expect(depOne.value).toEqual(FIRST_VALUE);
      expect(depTwo.value).toEqual(SECOND_VALUE);
    }
  });
});
