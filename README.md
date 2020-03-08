# TSURL

**Type safe URL construction and deconstruction**

[![CircleCI](https://circleci.com/gh/JakeSidSmith/tsurl.svg?style=svg)](https://circleci.com/gh/JakeSidSmith/tsurl)

## About

Until now you've probably been relying on keeping various bits of code in sync, or casting types `as` whatever you believe they should be to prevent errors when constructing, matching and or deconstructing URLs.

TSURL prevents the need for you to worry about keeping your path templates in sync with your URL parameters, worries about accidental `//` in paths, missing URL parameters, bad protocols, unintentional or missing trailing slashes, URL encoding and decoding, query parameter construction/deconstruction, and type casting.

Built on top of existing libraries that you're probably already using, such as `path-to-regexp`, `encodeurl` `query-string`, `url-parse`, etc, TSURL combines their functionality to provide a type safe interface for working with URls and paths.

## Browser support

This library only supports the modern browsers (latest Chrome, Firefox, Safari, etc), due to a reliance on `query-string@6` which only has support for modern browsers.

If you need to support older browsers (e.g. Internet Explorer) you should configure your bundler/compiler to compile both `@jakesidsmith/tsurl` and `query-string`.

## Installation

```shell
npm i @jakesidsmith/tsurl -S
```

`-S` is shorthand for `--save` and will automatically add this to your `package.json` and `package-lock.json` where necessary.

## Example with react-router

If you've ever used `react-router` this should be a great example of how TSURL can improve your code.

Let's define a TSURL for our user details page. This would be something like `/users/id/` where `id` is the users ID. react-router uses `path-to-regexp` behind the scenes and so would require a path with the syntax `/users/:id/`, but TSURL can handle this for you.

```ts
import createTSURL, { requiredString } from '@jakesidsmith/tsurl';

export const userDetailURL = createTSURL(['/users', requiredString('id')], {
  trailingSlash: true,
});
```

We can now use this TSURL instance to supply a path to our routes.

```tsx
import UserDetailPage from './users';
import { userDetailURL } from './urls';

// ...

<Route path={userDetailURL.getURLTemplate()} component={UserDetailPage} />;
```

This outputs a path with the same syntax as required by `react-router`.

Now, if you wanted to navigate to this URL you'd probably previously have used string concatenation, a template string, or `path-to-regexp` to construct the path, but none of these offer type safety. Instead now you can use your TSURL instance to construct a path. It will enforce that you provide a string for the user's ID.

```ts
const whereWeWantToGo = userDetailURL.construct({ id: 'abc' }, {});
```

This will output `/users/abc/` exactly as we'd expect, but would fail type checks if the `id` key was missing from the URL parameters object. The second argument is the query params object, but since we don't need any, we've just left this blank. Note: this method will throw an error if you somehow fail to supply the user id.

What if we now needed to extract the current user id from the URL? Well, we can handle that also.

```ts
try {
  const { id } = userDetailURL.deconstruct(window.location.href).urlParams;
  // Do something with the id
} catch (error) {
  // Bail here
}
```

It's sensible to wrap your deconstruct call in a try/catch as if the URL doesn't match the schema previously provided, then this will throw an error.

## Example with query params and type casting

Say we have a paginated users list, we may be storing the current page number in the query parameters. No worries, TSURL has got your back.

```ts
const userListURL = createTSURL(['/users'], {
  trailingSlash: true,
  queryParams: [optionalNumber('page')],
});
```

Here we've constructed a TSURL instance that will not only enforce that we provide a number (or nothing as we may not want to define the page number for the first page) when constructing a URL for this route, but also will give us sensible types for the parameters when deconstructing.

```ts
userListURL.construct({}, {}); // Is fine because page is optional
userListURL.construct({}, { page: 2 }); // Is fine because page should be a number

userListURL.construct({}, { page: '2' }); // Disallowed by types (would error)
userListURL.construct({}, { page: null }); // Disallowed by types (would error)

// The below deconstruct will handle casting the page query param to a number if found
userListURL.deconstruct(window.location.href);
// And output a type matching
interface Result {
  urlParams: {};
  queryParams: {
    page: number | undefined;
  };
}
```
