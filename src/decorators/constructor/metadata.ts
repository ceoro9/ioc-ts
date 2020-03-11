import { Container } from '../../container';


const CONSTRUCTOR_PARAMETER_METADATA_KEY = 'constructor:metadata';


export interface IConstructorParameterMetadata {
  parameterIndex: number;
  dependencyName?: string;
  container?: Container;
}

type InnerConstructorParameterMetadata = Omit<IConstructorParameterMetadata, 'parameterIndex'>;


/**
 * Adds constructor parameter metadata
 * @param ctor
 * @param parameterMetadata
 */
export function addConstructorParameterMetadata(ctor: any, parameterMetadata: IConstructorParameterMetadata) {
  const { parameterIndex, dependencyName, container } = parameterMetadata;
  const ctorParameterMetadatas = Reflect.getMetadata(CONSTRUCTOR_PARAMETER_METADATA_KEY, ctor) ?? {};
  const newParameterMetadata: InnerConstructorParameterMetadata = { dependencyName, container };
  Reflect.metadata(
    CONSTRUCTOR_PARAMETER_METADATA_KEY,
    {
      ...ctorParameterMetadatas,
      [parameterIndex]: newParameterMetadata,
    },
  )(ctor);
}


/**
 * Get constructor parameter metadata by its index
 * @param ctor
 * @param parameterIndex
 */
export function getConstructorParameterMetadata(ctor: any, parameterIndex: number) {
  const ctorParameterMetadatas = Reflect.getMetadata(CONSTRUCTOR_PARAMETER_METADATA_KEY, ctor) ?? {};
  return ctorParameterMetadatas[parameterIndex] as InnerConstructorParameterMetadata | undefined;
}
