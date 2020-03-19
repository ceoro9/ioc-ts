/**
 * Copies metadata from one function to another
 * @param source copy metadata from function
 * @param destination copy metadata to function
 */
export function copyFunctionMetadata(source: Function, destination: Function) {
  // copy main function properties
  destination.prototype = source.prototype;
  Object.defineProperty(destination, 'length', {
    writable: false,
    value: source.length,
  });
  Object.defineProperty(destination, 'name', {
    writable: false,
    value: source.name,
  });
  // copy metadata
  Reflect.getMetadataKeys(source).forEach((metadataKey: any) => {
    const metadataValue = Reflect.getMetadata(metadataKey, source);
    Reflect.metadata(metadataKey, metadataValue)(destination);
  });
}
