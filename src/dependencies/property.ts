import { Dependency }                  from './base';
import { ConstructorT }                from '../types';
import { createDependencyProxyObject } from '../proxy';


export class PropertyDependency extends Dependency {


  public resolve(dependencyName: string, ctor: ConstructorT, isLookUpInContainer: boolean) {

    // set dependency data
    this
      .setConstructor(ctor)
      .setName(dependencyName);

    // look up in container
    if (isLookUpInContainer) {
      const value = this.getContainer().getValue(dependencyName);
      if (!(value instanceof Dependency)) {
        this.setValue(value);
        return value;
      }
    }
    
    const dependencies = this.initDependencies(); 
    const result       = new ctor(...dependencies);
    const proxified    = createDependencyProxyObject(result);

    this.setValue(proxified);
  }
}
