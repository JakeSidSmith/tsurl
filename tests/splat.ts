import createTSURL, { requiredString, splat } from '../src';

describe('splat', () => {
  it('should construct and deconstruct all trailing URL parts', () => {
    const url = createTSURL(
      ['user', requiredString('userId'), splat('splat')],
      {
        trailingSlash: false,
        baseURL: 'https://example.com',
        basePath: '/api',
      }
    );

    // @tsassert: (urlParams: { userId: string; } & { splat?: readonly string[] | undefined; }, queryParams: {} & {}) => string
    const constructPath = url.constructPath;

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: { userId: string; } & { splat?: readonly string[] | undefined; }; queryParams: {} & {}; }
    const deconstruct = url.deconstruct;

    expect(constructPath({ userId: '123' }, {})).toBe('/api/user/123');
    expect(url.constructURL({ userId: '123' }, {})).toBe(
      'https://example.com/api/user/123'
    );
    expect(constructPath({ userId: '123', splat: [] }, {})).toBe(
      '/api/user/123'
    );
    expect(url.constructURL({ userId: '123', splat: [] }, {})).toBe(
      'https://example.com/api/user/123'
    );
    expect(constructPath({ userId: '123', splat: ['/posts/456'] }, {})).toBe(
      '/api/user/123/posts/456'
    );
    expect(url.constructURL({ userId: '123', splat: ['/posts/456'] }, {})).toBe(
      'https://example.com/api/user/123/posts/456'
    );
    expect(constructPath({ userId: '123', splat: ['posts', '456'] }, {})).toBe(
      '/api/user/123/posts/456'
    );
    expect(
      url.constructURL({ userId: '123', splat: ['posts', '456'] }, {})
    ).toBe('https://example.com/api/user/123/posts/456');
    expect(url.getPathTemplate()).toBe('/api/user/:userId/:splat*');
    expect(url.getURLTemplate()).toBe(
      'https://example.com/api/user/:userId/:splat*'
    );
    expect(deconstruct('/api/user/123')).toEqual({
      urlParams: {
        userId: '123',
        splat: undefined,
      },
      queryParams: {},
    });
    expect(deconstruct('https://example.com/api/user/123')).toEqual({
      urlParams: {
        userId: '123',
        splat: undefined,
      },
      queryParams: {},
    });
    expect(deconstruct('/api/user/123/')).toEqual({
      urlParams: {
        userId: '123',
        splat: undefined,
      },
      queryParams: {},
    });
    expect(deconstruct('https://example.com/api/user/123/')).toEqual({
      urlParams: {
        userId: '123',
        splat: undefined,
      },
      queryParams: {},
    });
    expect(deconstruct('/api/user/123/posts')).toEqual({
      urlParams: {
        userId: '123',
        splat: ['posts'],
      },
      queryParams: {},
    });
    expect(deconstruct('https://example.com/api/user/123/posts')).toEqual({
      urlParams: {
        userId: '123',
        splat: ['posts'],
      },
      queryParams: {},
    });
    expect(deconstruct('/api/user/123/posts/456/thing/stuff')).toEqual({
      urlParams: {
        userId: '123',
        splat: ['posts', '456', 'thing', 'stuff'],
      },
      queryParams: {},
    });
    expect(
      deconstruct('https://example.com/api/user/123/posts/456/thing/stuff')
    ).toEqual({
      urlParams: {
        userId: '123',
        splat: ['posts', '456', 'thing', 'stuff'],
      },
      queryParams: {},
    });
  });
});
