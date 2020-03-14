import { Container } from '../container';

// Injection function interface
export type InjectionDecorator = (dependencyName?: string, container?: Container) => Function;
