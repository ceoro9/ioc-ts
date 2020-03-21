# Decorators API
This document describes options that could be passed to decoratos to override default behavior of IoC container.


### @Injectable
Marks class as injectable entity and by default adds it to the global container. If binding name is not provided, class name will be used as identifier. If container parameter is provided, entity will be added to this container as well.

```ts
function Injectable(dependencyName?: string, container?: Container) 
```

### @Inject
Makes an injection. If binding name is not provided, type of property(if property injection) or type of constructor's parameter(if constructor injection) will be used as identifier. If container reference is not provided, global container will be used.
```ts
function Inject(bindingName?: string, container?: Container);
```
