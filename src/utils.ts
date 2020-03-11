/**
 * Copies metadata from one function to another
 * @param source copy metadata from function
 * @param destination copy metadata to function
 */
export function copyFunctionMetadata(source: Function, destination: Function) {
  destination.prototype = source.prototype;
  Object.defineProperty(destination, 'name', {
    writable: false,
    value: source.name,
  });
  Object.defineProperty(destination, 'length', {
    writable: false,
    value: source.length,
  });
  // TODO: make separate functino for this
  // copy constructors medata
  const ctorMetadatas = Reflect.getMetadata('constructor:metadata', source);
  if (ctorMetadatas) {
    Reflect.metadata('constructor:metadata', ctorMetadatas)(destination);
  }
}
