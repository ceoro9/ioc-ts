# Entity Declaration

`ioc-ts` uses class-based approach to declare and work with entities in your application. This allows you excplicitly and declaratively specify dependencies between them. And for `ioc-ts` the process of resolving of the dependencies becomes fully transparrent, which excludes the possibility of errors.

To declare an entity, at first you need to write a simple class, that does some piece of functionality, and mandatorily mark it with `Injectable` decorator. In that way you're telling `ioc-ts`, that this class is not just a plain class, but an injectable entity, which initializtion and destruction should be managed by IoC container.

```ts
import { Injectable } from '@ceoro9/ioc-ts';

@Injectable()
class UserService {

  public async findUserById(userId: string) {
    // ...
  }
}

@Injectable()
class BookService {

  public async findBooksByAuthorId(authorId: string) {
    // ...
  }
}
```

To declare a dependency between two entities, you need to make an injection of one entity to another one. There are many types of injections, that will be discussed further in documentation, but in our example we will consider the simplest and most straightforward one - property-based injection. Where one entity is injected into the property of another one. To do this, again we should declare an entity, create properties, where an instance of dependency will be injected by IoC container. And mark this properties with `Inject` decorator, in that way you're telling IoC container to manage, what entity instance in fact is stored in this properties.

```ts
import { Injectable, Inject } from '@ceoro9/ioc-ts';

@Injectable()
class AppController {

  @Inject()
  private userService: UserService;

  @Inject()
  private bookService: BookService;

  public async findBooksByUserId(userId: string) {
    const { authorId } = await this.userService.findUserById(userId);
    const books = await this.bookService.findBooksByAuthorId(authorId);
    return books;
  }
}
```
