import { Dependency }                  from './base';
import { ConstructorT }                from '../types';
import { Container }                   from '../container';
import { createDependencyProxyObject } from '../proxy';


export class ConstructorDependency extends Dependency {

  private readonly paramIndex: number;
  
  public constructor(name: string | undefined,
                     ctor: ConstructorT,
                     container: Container,
                     paramIndex: number) {

    super(name, ctor, container);
    this.paramIndex = paramIndex;
  }

  public resolve() {
    const ctor   = this.getConstructor();
    const deps   = this.initDependencies();
    const result = new ctor(...deps);
    return createDependencyProxyObject(result);
  }

  public getParamIndex() {
    return this.paramIndex;
  }
}
