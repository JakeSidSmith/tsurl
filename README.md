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

