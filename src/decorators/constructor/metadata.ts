import { Container } from '../../container';
import { ConstructorT } from '../../types';

const CONSTRUCTOR_PARAMETER_METADATA_KEY = 'constructor:metadata';

/**
 * IoC metadata
 */
export interface ConstructorParameterMetadata {
  parameterIndex: number;
  dependencyName?: string;
  container?: Container;
}

/**
 * Type of metadata stored in constructor
 */
type InnerConstructorParameterMetadata = Omit<ConstructorParameterMetadata, 'parameterIndex'>;

/**
 * Type of metadata returned by constructor parameter index
 */
export type OuterConstructorParameterMetadata = Omit<ConstructorParameterMetadata, 'parameterIndex'> & {
  designType: ConstructorT;
};

function getMetadata(target: any) {
  return (Reflect.getMetadata(CONSTRUCTOR_PARAMETER_METADATA_KEY, target) ?? {}) as {
    [paramIndex: number]: InnerConstructorParameterMetadata;
  };
}

function setMetadata(target: any, parameterIndex: number, value: InnerConstructorParameterMetadata) {
  const { dependencyName, container } = value;
  const currentCtorMetadata = getMetadata(target);
  Reflect.metadata(CONSTRUCTOR_PARAMETER_METADATA_KEY, {
    ...currentCtorMetadata,
    [parameterIndex]: {
      dependencyName,
      container,
    },
  })(target);
}

/**
 * Adds constructor parameter metadata
 * @param ctor
 * @param parameterMetadata
 */
export function addConstructorParameterMetadata(ctor: any, parameterMetadata: ConstructorParameterMetadata) {
  setMetadata(ctor, parameterMetadata.parameterIndex, parameterMetadata);
}

/**
 * Gets constructor parameter metadata by its index
 * @param ctor
 * @param parameterIndex
 */
export function getConstructorParameterMetadata(ctor: any, parameterIndex: number) {
  const paramDesignType = Reflect.getMetadata('design:paramtypes', ctor)[parameterIndex];
  const ctorParameterMetadata = getMetadata(ctor)[parameterIndex];
  return {
    designType: paramDesignType,
    ...ctorParameterMetadata,
  } as OuterConstructorParameterMetadata;
}
