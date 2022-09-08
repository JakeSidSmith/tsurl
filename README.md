# TSURL

**Type safe URL construction and deconstruction**

[![CircleCI](https://circleci.com/gh/JakeSidSmith/tsurl.svg?style=svg)](https://circleci.com/gh/JakeSidSmith/tsurl)

## About

Until now you've probably been relying on keeping various bits of code in sync, or casting types `as` whatever you believe they should be to prevent errors when constructing, matching and or deconstructing URLs.

TSURL prevents the need for you to worry about keeping your path templates in sync with your URL parameters, worries about accidental `//` in paths, missing URL parameters, unintentional or missing trailing slashes, URL encoding and decoding, query parameter construction/deconstruction, and type casting.

Built on top of existing libraries that you're probably already using, such as `path-to-regexp`, `encodeurl` `query-string`, `url-parse`, etc, TSURL combines their functionality to provide a type safe interface for working with URLs and paths.

## Browser support

This library only supports modern browsers (latest Chrome, Firefox, Safari, etc), due to a reliance on `query-string@6` which only has support for modern browsers.

If you need to support older browsers (e.g. Internet Explorer) you should configure your bundler/compiler to compile both `@jakesidsmith/tsurl` and `query-string`.

## Installation

```shell
npm i @jakesidsmith/tsurl -S
```

`-S` is shorthand for `--save` and will automatically add this to your `package.json` and `package-lock.json` where necessary.

## Example with react-router

If you've ever used `react-router` this should be a great example of how TSURL can improve your code.

Let's define a TSURL for our user details page. This would be something like `/users/id/` where `id` is the user's ID. `react-router` uses `path-to-regexp` behind the scenes and so would require a path with the syntax `/users/:id/`, but TSURL can handle this for you.

```ts
import { createTSURL, requiredString } from '@jakesidsmith/tsurl';

export const userDetailURL = createTSURL(['/users', requiredString('id')], {
  trailingSlash: true,
});
```

We can now use this TSURL instance to supply a path to our routes.

```tsx
import UserDetailPage from './users';
import { userDetailURL } from './urls';

// ...

<Route path={userDetailURL.getPathTemplate()} component={UserDetailPage} />;
```

This outputs a path with the same syntax as required by `react-router`.

Now, if you wanted to navigate to this URL you'd probably previously have used string concatenation, a template string, or `path-to-regexp` to construct the path, but none of these offer type safety. Instead now you can use your TSURL instance to construct a path. It will enforce that you provide a string for the user's ID.

```ts
const whereWeWantToGo = userDetailURL.constructPath({ id: 'abc' }, {});
```

This will output `/users/abc/` exactly as we'd expect, but would fail type checks if the `id` key was missing from the URL parameters object. The second argument is the query params object, but since we don't need any, we've just provided an empty object. Note: this method will throw an error if you somehow fail to supply the user id e.g. not using type checking, or cast your params to `any`.

What if we now needed to extract the current user ID from the URL? Well, we can handle that also.

```ts
try {
  const { id } = userDetailURL.deconstruct(window.location.href).urlParams;
  // Do something with the id
} catch (error) {
  // Bail here
}
```

It's sensible to wrap your deconstruct calls in a try/catch as if the URL doesn't match the schema previously provided, then this will throw an error. Unfortunately there's no way to check that the URL provided will match the schema at compile time.

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
userListURL.constructPath({}, {}); // Is fine because page is optional
userListURL.constructPath({}, { page: 2 }); // Is fine because page should be a number

userListURL.constructPath({}, { page: '2' }); // Disallowed by types (would error)
userListURL.constructPath({}, { page: null }); // Disallowed by types (would error)

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

## Example with `baseURL`/`basePath`

If all of your requests are prefixed with a specific domain and or path you can provide a `baseURL` and or `basePath` as an option. The `baseURL` may include protocol, host, port, and base path, but I'd recommend using `basePath` for paths in most circumstances.

Note: the `baseURL` is not affected by the `normalize` option, except where a base URL with a trailing slash and a path with a leading slash would cause an unwanted double slash e.g. `baseURL: https://domain.com/api/` and path `/users` would output `https://domain.com/api/users` instead of `https://domain.com/api//users`.

Example base URLs:

```txt
'domain.com'
'https://domain.com'
'http://localhost:1234'
'/api/'
'domain.com/api/'
'https://domain.com/api'
'http://localhost:1234/api'
```

Example output:

```tsx
const url = createTSURL(['/users', requiredString('userId')], {
  baseURL: 'https://domain.com/',
  basePath: '/api',
});

url.getURLTemplate();
// https://domain.com/api/users/:userId
url.getPathTemplate();
// /api/users/:userId
url.constructURL({ userId: 'abc' }, {});
// https://domain.com/api/users/abc
url.constructPath({ userId: 'abc' }, {});
// /api/users/abc
```

## Example using groups

If we have our API running on a different domain we can use groups to pre-fill `baseURL`, `basePath` (and or any other options) for client and API URLs.

```ts
const api = createTSURLGroup({
  baseUrl: 'https://server.com',
  basePath: '/api',
  trailingSlash: true,
});

const API_URLS = {
  users: api.createTSURL(['users']),
  user: api.createTSURL(['users', requiredString('userId')]),
  userImages: api.createTSURL(['users', requiredString('userId'), 'images']),
};

const client = createTSURLGroup({
  baseUrl: 'https://client.com',
  trailingSlash: false,
});

const CLIENT_URLS = {
  users: client.createTSURL(['users']),
  user: client.createTSURL(['users', requiredString('userId')]),
};
```

## Example using splat

If we want to match any trailing part of a URL/path we can do so using a `splat` URL part.

```ts
const url = createTSURL(['user', requiredString('userId'), splat('splat')], {
  baseUrl: 'https://server.com',
  basePath: '/api',
  trailingSlash: false,
});

url.constructPath({ userId: 'abc' }, {});
// returns '/api/user/abc'

url.constructPath({ userId: 'abc', splat: ['posts', '123'] }, {});
// returns '/api/user/abc/posts/123'

url.deconstruct('https://server.com/api/user/abc');
// returns { urlParams: { userId: 'abc', splat: undefined }, queryParams: {} }

url.deconstruct('https://server.com/api/user/123/posts/123');
// returns { urlParams: { userId: '123', splat: ['posts', '123'] }, queryParams: {} }
```

## Allow sub-paths when you don't want to match a splat

In some cases you want your URL templates to match a specific template, but when deconstructing you don't mind if the URL/path contains additional sub-paths. In these cases you can pass the `allowSubPaths` option to the deconstruct method.

```ts
const url = createTSURL(['user', requiredString('userId')], {
  baseUrl: 'https://server.com',
  basePath: '/api',
  trailingSlash: false,
});

url.deconstruct('https://server.com/api/user/123/posts/123');
// throws an error

url.deconstruct('https://server.com/api/user/123/posts/123', {
  allowSubPaths: true,
});
// returns { urlParams: { userId: '123' }, queryParams: {} }
```

## API

### createTSURL

The `createTSURL` function, which is also the default export, will construct a TSURL instance.

This takes 1 or 2 arguments:

- URL schema - an array of `strings` and or [parameters](#parameters)
- An options object (optional) - `Options` - see [Options](#options) for more info

Returns `TSURL` with inferred keys for URL and query params.

### createTSURLGroup

The `createTSURLGroup` function, returns an object with a `createTSURL` function.

This takes 1 argument:

- An options object - `Options` - see [Options](#options) for more info

#### group.createTSURL

As with the named/default exported `createTSURL`, but inherits options from the group.

### TSURL.getURLTemplate

Returns a `path-to-regexp` compatible URL (including the `baseURL`) `string` from your defined schema.

This method takes no arguments.

### TSURL.getPathTemplate

Returns a `path-to-regexp` compatible path (excluding the `baseURL`) `string` from your defined schema.

This method takes no arguments.

### TSURL.constructURL

Returns a `string` URL (including the `baseURL`).

This takes 2 arguments:

- The URL params for this URL - an object with keys that match the required/optional URL params
- The Query params for this URL - an object with keys that match the required/optional query params

Note: this method will throw an error if you have not supplied required url/query params somehow (e.g. if you are not using type checking because your app is written in JavaScript, or you have cast your params to `any` in TypeScript).

### TSURL.constructPath

Returns a `string` path (excluding the `baseURL`).

This takes 2 arguments:

- The URL params for this URL - an object with keys that match the required/optional URL params
- The Query params for this URL - an object with keys that match the required/optional query params

Note: this method will throw an error if you have not supplied required url/query params somehow (e.g. if you are not using type checking because your app is written in JavaScript, or you have cast your params to `any` in TypeScript).

### TSURL.constructQuery

Returns a `string` of query params (prefixed with `?`) if any are provided.

This takes 1 argument:

- The Query params for this URL - an object with keys that match the required/optional query params

Note: this method will throw an error if you have not supplied required query params somehow (e.g. if you are not using type checking because your app is written in JavaScript, or you have cast your params to `any` in TypeScript).

### TSURL.deconstruct

Returns the URL and query params extracted from a string URL/path.

This takes 1 or 2 arguments:

- URL/path - `string` - the URL you wish to extract parameters from
- An options object (optional) - `Options` - see [Deconstruct Options](#deconstructoptions) for more info

Returns an object with `urlParams` and `queryParams` keys. Both of these keys will be objects containing the parameters you defined in your schema e.g.

```ts
interface Result {
  urlParams: {
    organization: string;
  };
  queryParams: {
    users: readonly string[];
    search: string;
    page: number | undefined;
  };
}
```

Note: this method will throw an error if the URL/path does not match the previously defined schema. You should always wrap calls to deconstruct in a try/catch as the string that you provide contains no type information, and we cannot check at compile time.

### Options

The options object is the second argument to the `createTSURL` function. All available options are optional.

Options include:

- `baseURL` - `string` - base URL to prefix constructed URLs with (can include protocol, host, port, and base path e.g. `https://domain.com/api`).
- `basePath` - `string | readonly string[]` - path to prefix the schema (path parts) for all URLs created with the group.
- `trailingSlash` - `boolean` - enforce or remove trailing slashes. Does nothing by default.
- `encode` - `boolean` - whether to encode the URL when constructing. Defaults to `true`.
- `decode` - `boolean` - whether to decode the URL when deconstructing. Default to `true`.
- `normalize` - `boolean` - whether to strip **all** double slashes from the path (`//`, excluding the `baseURL`, except where this causes multiple trailing slashes e.g. `createTSURL` with `baseURL: 'https://domain.com/api/'` and path parts `['/users']` will construct `https://domain.com/api/users`). Defaults to `true`.
- `queryArrayFormat` - how to handle constructing/deconstructing query params that can have multiple values. This option is defined by the `query-string` package.
- `queryArrayFormatSeparator` - `string` - the separator to use when `queryArrayFormat` is set to `separator`. Defaults to `,`.
- `queryParams` - an array of [parameters](#parameters).

### Deconstruct Options

This is the second argument to the `deconstruct` function.

Options include:

- `allowSubPaths` - `boolean` - whether the deconstruction will allow sub-paths (stuff that appears after your defined template) in the provided URL/path

### Parameters

There are a lot of functions that you can use to define parameters.

The URL schema supports the following:

- `requiredString`
- `requiredNumber`
- `requiredBoolean`
- `optionalString`
- `optionalNumber`
- `optionalBoolean`
- `splat`

The query params schema supports the following:

- `requiredString`
- `requiredNumber`
- `requiredBoolean`
- `optionalString`
- `optionalNumber`
- `optionalBoolean`
- `requiredStringArray`
- `requiredNumberArray`
- `requiredBooleanArray`
- `optionalStringArray`
- `optionalNumberArray`
- `optionalBooleanArray`

## Contributing

### Setup

Ensure you are using a compatible version of NodeJS (16) and NPM (8).

If you're using NVM you can simply:

```shell
nvm use
```

And ensure you have NPM 8 installed globally:

```shell
npm i npm@8 -g
```

Then run a clean install to get fresh dependencies:

```shell
npm ci
```

### Scripts

Run type-checking, linting and tests with:

```shell
npm test
```

You can fix formatting issues by running:

```shell
npm run prettier
```
