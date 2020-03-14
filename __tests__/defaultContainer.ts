import { Inject, Injectable, Container } from '../src';


describe('Injectable entities presence', () => {

  beforeEach(() => {
    // remove all entities from default container
    const defaultContainer = Container.getDefault();
    defaultContainer.clear();
  });

  test('All implicit injectables must presence in default container', () => {

    @Injectable()
    class DependencyOne {}
  
    @Injectable()
    class DependencyTwo {}
  
    const container = Container.getDefault();

    const depOne = container.get(DependencyOne);
    const depTwo = container.get(DependencyTwo);
    
    expect(depOne).toBeDefined();
    expect(depTwo).toBeDefined();
    
    expect(depOne).toBeInstanceOf(DependencyOne);
    expect(depTwo).toBeInstanceOf(DependencyTwo);
  });

  test('All explicit injectables must presence in default container', () => {

    const DEPENDENCY_ONE_NAME = 'DEPENDENCY_ONE_NAME';
    const DEPENDENCY_TWO_NAME = 'DEPENDENCY_TWO_NAME';

    @Injectable(DEPENDENCY_ONE_NAME)
    class DependencyOne {}

    @Injectable(DEPENDENCY_TWO_NAME)
    class DependencyTwo {}

    const container = Container.getDefault();

    const depOne = container.get(DEPENDENCY_ONE_NAME);
    const depTwo = container.get(DEPENDENCY_TWO_NAME);

    expect(depOne).toBeDefined();
    expect(depTwo).toBeDefined();
    
    expect(depOne).toBeInstanceOf(DependencyOne);
    expect(depTwo).toBeInstanceOf(DependencyTwo);
  });

  test('All binded injectables to custom container, anyway must presence in default one', () => {

    @Injectable()
    class DependencyOne {}

    @Injectable()
    class DependencyTwo {}

    const customContainer = new Container();
    customContainer.bind(DependencyOne);
    customContainer.bind(DependencyTwo);

    const defaultContainer = Container.getDefault();

    const depOne = defaultContainer.get(DependencyOne);
    const depTwo = defaultContainer.get(DependencyTwo);
    
    expect(depOne).toBeDefined();
    expect(depTwo).toBeDefined();
    
    expect(depOne).toBeInstanceOf(DependencyOne);
    expect(depTwo).toBeInstanceOf(DependencyTwo);
  });
});


describe('Property injection', () => {

  beforeEach(() => {
    // remove all entities from default container
    const defaultContainer = Container.getDefault();
    defaultContainer.clear();
  });

  test('Implicit injection is resolved', () => {

    @Injectable()
    class DependencyOne {}

    @Injectable()
    class DependencyTwo {

      @Inject()
      private depOne: DependencyOne;

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const defaultContainer = Container.getDefault();

    const depTwo = defaultContainer.get(DependencyTwo);
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });

  test('Explicit injection is resolved', () => {

    const DEPENDENCY_ONE_NAME = 'DEPENDENCY_ONE_NAME';
    const DEPENDENCY_TWO_NAME = 'DEPENDENCY_TWO_NAME';

    @Injectable(DEPENDENCY_ONE_NAME)
    class DependencyOne {}

    @Injectable(DEPENDENCY_TWO_NAME)
    class DependencyTwo {

      @Inject(DEPENDENCY_ONE_NAME)
      private depOne: DependencyOne;

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const defaultContainer = Container.getDefault();

    const depTwo = defaultContainer.get(DEPENDENCY_TWO_NAME) as DependencyTwo;
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });

});


describe('Constructor injection', () => {

  beforeEach(() => {
    // remove all entities from default container
    const defaultContainer = Container.getDefault();
    defaultContainer.clear();
  });

  test('Implicit injection is resolved', () => {

    @Injectable()
    class DependencyOne {}

    @Injectable()
    class DependencyTwo {

      public constructor(@Inject() private readonly depOne: DependencyOne) {}

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const defaultContainer = Container.getDefault();

    const depTwo = defaultContainer.get(DependencyTwo);
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });

  test('Explicit injection is resolved', () => {

    const DEPENDENCY_ONE_NAME = 'DEPENDENCY_ONE_NAME';
    const DEPENDENCY_TWO_NAME = 'DEPENDENCY_TWO_NAME';

    @Injectable(DEPENDENCY_ONE_NAME)
    class DependencyOne {}

    @Injectable(DEPENDENCY_TWO_NAME)
    class DependencyTwo {

      public constructor(@Inject(DEPENDENCY_ONE_NAME) private readonly depOne: DependencyOne) {}

      public getDependencyOne() {
        return this.depOne;
      }
    }

    const defaultContainer = Container.getDefault();

    const depTwo = defaultContainer.get(DEPENDENCY_TWO_NAME) as DependencyTwo;
    const depOne = depTwo.getDependencyOne();

    expect(depOne).toBeDefined();
    expect(depOne).toBeInstanceOf(DependencyOne);
  });
});
