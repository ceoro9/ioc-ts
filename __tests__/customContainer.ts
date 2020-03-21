import { Inject, Injectable, Container } from '../src';

describe('Injectable entities presence', () => {

  const customContainer = new Container();

  const CustomInjectable = (entityName?: string) => {
    return Injectable(entityName, customContainer);
  }

  beforeEach(() => {
    // remove all entities from custom and global container
    customContainer.clear();
    Container.getGlobal().clear();
  });

  test('All implicit injectables', () => {
    @CustomInjectable()
    class DependencyOne {}

    @CustomInjectable()
    class DependencyTwo {}

    const depOne = customContainer.get(DependencyOne);
    const depTwo = customContainer.get(DependencyTwo);

    expect(depOne).toBeDefined();
    expect(depTwo).toBeDefined();

    expect(depOne).toBeInstanceOf(DependencyOne);
    expect(depTwo).toBeInstanceOf(DependencyTwo);
  });

  test('All explicit injectables', () => {
    const DEPENDENCY_ONE_NAME = 'DEPENDENCY_ONE_NAME';
    const DEPENDENCY_TWO_NAME = 'DEPENDENCY_TWO_NAME';

    @CustomInjectable(DEPENDENCY_ONE_NAME)
    class DependencyOne {}

    @CustomInjectable(DEPENDENCY_TWO_NAME)
    class DependencyTwo {}

    const depOne = customContainer.get(DEPENDENCY_ONE_NAME);
    const depTwo = customContainer.get(DEPENDENCY_TWO_NAME);

    expect(depOne).toBeDefined();
    expect(depTwo).toBeDefined();

    expect(depOne).toBeInstanceOf(DependencyOne);
    expect(depTwo).toBeInstanceOf(DependencyTwo);
  });
});

describe('Property injection', () => {

  const customContainer = new Container();

  const CustomInjectable = (entityName?: string) => {
    return Injectable(entityName, customContainer);
  }

  const CustomInject = (entityName?: string) => {
    return Inject(entityName, customContainer);
  }

  beforeEach(() => {
    // remove all entities from custom and global container
    customContainer.clear();
    Container.getGlobal().clear();
  });

  test('Implicit injection is resolved', () => {

    @CustomInjectable()
    class DependencyOne {}

    @CustomInjectable()
    class DependencyTwo {

      @CustomInject()
      private depOne: DependencyOne;

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const depTwo = customContainer.get(DependencyTwo);
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });

  test('Explicit injection is resolved', () => {
    const DEPENDENCY_ONE_NAME = 'DEPENDENCY_ONE_NAME';
    const DEPENDENCY_TWO_NAME = 'DEPENDENCY_TWO_NAME';

    @CustomInjectable(DEPENDENCY_ONE_NAME)
    class DependencyOne {}

    @CustomInjectable(DEPENDENCY_TWO_NAME)
    class DependencyTwo {

      @CustomInject(DEPENDENCY_ONE_NAME)
      private depOne: DependencyOne;

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const depTwo = customContainer.get(DEPENDENCY_TWO_NAME) as DependencyTwo;
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });
});

describe('Constructor injection', () => {

  const customContainer = new Container();

  const CustomInjectable = (entityName?: string) => {
    return Injectable(entityName, customContainer);
  }

  const CustomInject = (entityName?: string) => {
    return Inject(entityName, customContainer);
  }

  beforeEach(() => {
    // remove all entities from custom and global container
    customContainer.clear();
    Container.getGlobal().clear();
  });

  test('Implicit injection is resolved', () => {
    @CustomInjectable()
    class DependencyOne {}

    @CustomInjectable()
    class DependencyTwo {
      public constructor(@CustomInject() private readonly depOne: DependencyOne) {}

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const depTwo = customContainer.get(DependencyTwo);
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });

  test('Explicit injection is resolved', () => {
    const DEPENDENCY_ONE_NAME = 'DEPENDENCY_ONE_NAME';
    const DEPENDENCY_TWO_NAME = 'DEPENDENCY_TWO_NAME';

    @CustomInjectable(DEPENDENCY_ONE_NAME)
    class DependencyOne {}

    @CustomInjectable(DEPENDENCY_TWO_NAME)
    class DependencyTwo {
      public constructor(@CustomInject(DEPENDENCY_ONE_NAME) private readonly depOne: DependencyOne) {}

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const depTwo = customContainer.get(DEPENDENCY_TWO_NAME) as DependencyTwo;
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });
});
