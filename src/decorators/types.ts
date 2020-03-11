import { Container } from '../container';


// Injection function interface
export type InjectionDecorator = (dependencyName?: string, container?: Container) => Function;


export interface IConstructorMetadata {
  parameterIndex: number;
  dependencyName?: string;
  container?: Container;
}


export function makeConstructorMedata(parameterIndex: number,
                                      dependencyName?: string,
                                      container?: Container): IConstructorMetadata {
  return {
    parameterIndex,
    dependencyName,
    container,
  };
}
