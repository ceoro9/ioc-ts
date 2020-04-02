import { Container } from './main';

export interface AsyncInjectableInstance {
  setUp(): Promise<void>;
  tearDown(): Promise<void>;
}

export type ContainerSyncBinding = Container['bind'];

export type ContainerAsyncBinding = Container['bindAsync'];

export type AddContainerBinding = ContainerSyncBinding & ContainerAsyncBinding;
