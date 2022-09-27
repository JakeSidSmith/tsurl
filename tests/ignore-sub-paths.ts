import createTSURL, { requiredString } from '../src';

describe('ignoreSubPaths', () => {
  it('should allow deconstructing a URL or path that matches the schema, but with additional sub-paths', () => {
    const url1 = createTSURL(['user', requiredString('userId')], {
      baseURL: 'https://example.com',
      basePath: '/api',
    });

    expect(() =>
      url1.deconstruct('https://example.com/api/user/123/posts/456')
    ).toThrow(/invalid\sfor\stemplate/);
    expect(
      url1.deconstruct('https://example.com/api/user/123/posts/456', {
        ignoreSubPaths: true,
      })
    ).toEqual({
      urlParams: {
        userId: '123',
      },
      queryParams: {},
    });
    expect(
      url1.deconstruct('https://example.com/api/user/123', {
        ignoreSubPaths: true,
      })
    ).toEqual({
      urlParams: {
        userId: '123',
      },
      queryParams: {},
    });

    const url2 = createTSURL(['user', requiredString('userId')], {
      baseURL: 'https://example.com',
      basePath: '/api',
      trailingSlash: true,
    });

    expect(() =>
      url2.deconstruct('https://example.com/api/user/123/posts/456')
    ).toThrow(/invalid\sfor\stemplate/);
    expect(
      url2.deconstruct('https://example.com/api/user/123/posts/456', {
        ignoreSubPaths: true,
      })
    ).toEqual({
      urlParams: {
        userId: '123',
      },
      queryParams: {},
    });
  });
});
