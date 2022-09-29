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
  it('should throw if a "requiredEnum" has an invalid value', () => {
    const url = createTSURL(['test', requiredEnum('test1', TestEnum)], {
      baseURL: 'https://example.com',
      basePath: '/api',
      queryParams: [requiredEnum('test2', TestEnum)],
    });

    expect(() =>
      url.deconstruct('https://example.com/api/test/FOUR?test2=ONE')
    ).toThrow(/Invalid value for part "test1" - FOUR/);
    expect(() =>
      url.deconstruct('https://example.com/api/test/FOUR?test2=ONE', {
        ignoreInvalidEnums: true,
      })
    ).toThrow(/Invalid value for part "test1" - FOUR/);

    expect(() =>
      url.deconstruct('https://example.com/api/test/ONE?test2=FOUR')
    ).toThrow(/Invalid value for part "test2" - FOUR/);
    expect(() =>
      url.deconstruct('https://example.com/api/test/ONE?test2=FOUR', {
        ignoreInvalidEnums: true,
      })
    ).toThrow(/Invalid value for part "test2" - FOUR/);
  });

  it('should omit invalid values if a "optionalEnum" has an invalid value', () => {
    const url = createTSURL(['test', optionalEnum('test1', TestEnum)], {
      baseURL: 'https://example.com',
      basePath: '/api',
      queryParams: [optionalEnum('test2', TestEnum)],
    });

    expect(() =>
      url.deconstruct('https://example.com/api/test/FOUR?test2=ONE')
    ).toThrow(/Invalid value for part "test1" - FOUR/);
    expect(
      url.deconstruct('https://example.com/api/test/FOUR?test2=ONE', {
        ignoreInvalidEnums: true,
      })
    ).toEqual({
      urlParams: {
        test1: undefined,
      },
      queryParams: {
        test2: 'ONE',
      },
    });

    expect(() =>
      url.deconstruct('https://example.com/api/test/ONE?test2=FOUR')
    ).toThrow(/Invalid value for part "test2" - FOUR/);
    expect(
      url.deconstruct('https://example.com/api/test/ONE?test2=FOUR', {
        ignoreInvalidEnums: true,
      })
    ).toEqual({
      urlParams: {
        test1: 'ONE',
      },
      queryParams: {
        test2: undefined,
      },
    });
  });

  it('should omit invalid values if a "requiredEnumArray" has invalid values', () => {
    const url = createTSURL(['test'], {
      baseURL: 'https://example.com',
      basePath: '/api',
      queryParams: [requiredEnumArray('test1', TestEnum)],
    });

    expect(() =>
      url.deconstruct(
        'https://example.com/api/test?test1=ONE&test1=TWO&test1=FOUR'
      )
    ).toThrow(/Invalid value for part "test1" - ONE,TWO,FOUR/);
    expect(
      url.deconstruct(
        'https://example.com/api/test?test1=ONE&test1=TWO&test1=FOUR',
        {
          ignoreInvalidEnums: true,
        }
      )
    ).toEqual({
      urlParams: {},
      queryParams: {
        test1: ['ONE', 'TWO'],
      },
    });
    expect(() =>
      url.deconstruct(
        'https://example.com/api/test?test1=FOUR&test1=FIVE&test1=SIX',
        {
          ignoreInvalidEnums: true,
        }
      )
    ).toThrow(/Invalid value for part "test1" - FOUR,FIVE,SIX/);
  });

  it('should omit invalid values if a "optionalEnumArray" has invalid values', () => {
    const url = createTSURL(['test'], {
      baseURL: 'https://example.com',
      basePath: '/api',
      queryParams: [optionalEnumArray('test1', TestEnum)],
    });

    expect(() =>
      url.deconstruct(
        'https://example.com/api/test?test1=ONE&test1=TWO&test1=FOUR'
      )
    ).toThrow(/Invalid value for part "test1" - ONE,TWO,FOUR/);
    expect(
      url.deconstruct(
        'https://example.com/api/test?test1=ONE&test1=TWO&test1=FOUR',
        {
          ignoreInvalidEnums: true,
        }
      )
    ).toEqual({
      urlParams: {},
      queryParams: {
        test1: ['ONE', 'TWO'],
      },
    });
    expect(
      url.deconstruct(
        'https://example.com/api/test?test1=FOUR&test1=FIVE&test1=SIX',
        {
          ignoreInvalidEnums: true,
        }
      )
    ).toEqual({
      urlParams: {},
      queryParams: {
        test1: undefined,
      },
    });
  });
});
