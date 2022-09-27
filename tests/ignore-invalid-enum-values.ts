import createTSURL, {
  optionalEnumArray,
  optionalEnum,
  requiredEnumArray,
  requiredEnum,
} from '../src';

enum TestEnum {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
}

describe('ignoreInvalidEnums', () => {
  it('should allow deconstructing a URL or path that has invalid enum values without throwing', () => {
    const url1 = createTSURL(
      [
        'test',
        requiredEnum('test1', TestEnum),
        optionalEnum('test2', TestEnum),
      ],
      {
        baseURL: 'https://example.com',
        basePath: '/api',
        queryParams: [],
      }
    );

    expect(() =>
      url1.deconstruct('https://example.com/api/test/FOUR/THREE')
    ).toThrow(/Invalid value for part "test1" - FOUR/);
    expect(
      url1.deconstruct('https://example.com/api/test/FOUR/THREE', {
        ignoreInvalidEnums: true,
      })
    ).toEqual({
      urlParams: {
        test1: 'FOUR',
        test2: 'THREE',
      },
      queryParams: {},
    });

    expect(() =>
      url1.deconstruct('https://example.com/api/test/ONE/test')
    ).toThrow(/Invalid value for part "test2" - test/);
    expect(
      url1.deconstruct('https://example.com/api/test/ONE/test', {
        ignoreInvalidEnums: true,
      })
    ).toEqual({
      urlParams: {
        test1: 'ONE',
        test2: 'test',
      },
      queryParams: {},
    });

    const url2 = createTSURL(['test'], {
      baseURL: 'https://example.com',
      basePath: '/api',
      queryParams: [
        requiredEnum('test1', TestEnum),
        requiredEnumArray('test2', TestEnum),
        optionalEnum('test3', TestEnum),
        optionalEnumArray('test4', TestEnum),
      ],
    });

    expect(() =>
      url2.deconstruct(
        'https://example.com/api/test/?test1=FOUR&test2=ONE&test3=ONE&test4=ONE'
      )
    ).toThrow(/Invalid value for part "test1" - FOUR/);
    expect(() =>
      url2.deconstruct(
        'https://example.com/api/test/?test1=ONE&test2=FOUR&test3=ONE&test4=ONE'
      )
    ).toThrow(/Invalid value for part "test2" - FOUR/);
    expect(() =>
      url2.deconstruct(
        'https://example.com/api/test/?test1=ONE&test2=ONE&test3=FOUR&test4=ONE'
      )
    ).toThrow(/Invalid value for part "test3" - FOUR/);
    expect(() =>
      url2.deconstruct(
        'https://example.com/api/test/?test1=ONE&test2=ONE&test3=ONE&test4=FOUR'
      )
    ).toThrow(/Invalid value for part "test4" - FOUR/);
    expect(
      url2.deconstruct(
        'https://example.com/api/test/?test1=FOUR&test2=FOUR&test3=FOUR&test4=FOUR&test4=FIVE',
        {
          ignoreInvalidEnums: true,
        }
      )
    ).toEqual({
      urlParams: {},
      queryParams: {
        test1: 'FOUR',
        test2: ['FOUR'],
        test3: 'FOUR',
        test4: ['FOUR', 'FIVE'],
      },
    });
  });
});
