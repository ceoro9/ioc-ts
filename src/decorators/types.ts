import { Container } from '../container';

export type InjectionDecorator = (dependencyName?: string, container?: Container) => Function;

// TODO
export type InjectableDecorator = <T>(dependencyName?: string, container?: Container) => (target: T) => any;
