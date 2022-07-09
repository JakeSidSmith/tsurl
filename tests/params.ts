import createTSURL, {
  optionalBoolean,
  optionalBooleanArray,
  optionalNumber,
  optionalNumberArray,
  optionalString,
  optionalStringArray,
  requiredBoolean,
  requiredBooleanArray,
  requiredNumber,
  requiredNumberArray,
  requiredString,
  requiredStringArray,
} from '../src';

describe('params', () => {
  it('should all be handled by the TSURL deconstruct method (without optional values)', () => {
    const url = createTSURL(
      [
        '/api//test/',
        requiredString('a'),
        requiredNumber('b'),
        requiredBoolean('c1'),
        requiredBoolean('c2'),
        optionalString('d'),
        optionalNumber('e'),
        optionalBoolean('f'),
      ],
      {
        queryParams: [
          requiredString('a'),
          requiredNumber('b'),
          requiredBoolean('c1'),
          requiredBoolean('c2'),
          optionalString('d'),
          optionalNumber('e'),
          optionalBoolean('f'),
          requiredStringArray('g'),
          requiredNumberArray('h'),
          requiredBooleanArray('i'),
          optionalStringArray('j'),
          optionalNumberArray('k'),
          optionalBooleanArray('l'),
        ],
      }
    );

    const urlString =
      '/api/test/a/1/true/false/?a=a&b=1&c1=true&c2=false&g=g1&g=g2&h=1&h=2&i=true&i=false';

    expect(url.deconstruct(urlString)).toEqual({
      urlParams: {
        a: 'a',
        b: 1,
        c1: true,
        c2: false,
        d: undefined,
        e: undefined,
        f: undefined,
      },
      queryParams: {
        a: 'a',
        b: 1,
        c1: true,
        c2: false,
        d: undefined,
        e: undefined,
        f: undefined,
        g: ['g1', 'g2'],
        h: [1, 2],
        i: [true, false],
        j: undefined,
        k: undefined,
        l: undefined,
      },
    });
  });

  it('should all be handled by the TSURL deconstruct method (with optional values)', () => {
    const url = createTSURL(
      [
        '/api//test/',
        requiredString('a'),
        requiredNumber('b'),
        requiredBoolean('c1'),
        requiredBoolean('c2'),
        optionalString('d'),
        optionalNumber('e'),
        optionalBoolean('f'),
      ],
      {
        queryParams: [
          requiredString('a'),
          requiredNumber('b'),
          requiredBoolean('c1'),
          requiredBoolean('c2'),
          optionalString('d'),
          optionalNumber('e'),
          optionalBoolean('f1'),
          optionalBoolean('f2'),
          requiredStringArray('g'),
          requiredNumberArray('h'),
          requiredBooleanArray('i'),
          optionalStringArray('j'),
          optionalNumberArray('k'),
          optionalBooleanArray('l'),
        ],
      }
    );

    const urlString =
      '/api/test/a/1/true/false/d/2/true?a=a&b=1&c1=true&c2=false&d=d&e=2&f1=true&f2=false&g=g1&g=g2&h=1&h=2&i=true&i=false&j=j&k=3&l=false&l=true';

    expect(url.deconstruct(urlString)).toEqual({
      urlParams: {
        a: 'a',
        b: 1,
        c1: true,
        c2: false,
        d: 'd',
        e: 2,
        f: true,
      },
      queryParams: {
        a: 'a',
        b: 1,
        c1: true,
        c2: false,
        d: 'd',
        e: 2,
        f1: true,
        f2: false,
        g: ['g1', 'g2'],
        h: [1, 2],
        i: [true, false],
        j: ['j'],
        k: [3],
        l: [false, true],
      },
    });
  });

  it('should handle constructing and deconstructing both required and optional strings', () => {
    const url = createTSURL(
      [
        '/api/example',
        requiredString('required'),
        'test',
        optionalString('optional'),
      ],
      {
        queryParams: [requiredString('requiredQ'), optionalString('optionalQ')],
      }
    );

    // @tsassert: (urlParams: { required: string; } & {} & {} & { optional?: string | undefined; } & {} & {}, queryParams: { requiredQ: string; } & {} & {} & { optionalQ?: string | undefined; } & {} & {} & {} & {} & {} & {} & {} & {}) => string
    const construct = url.construct;

    expect(construct({ required: 'a' }, { requiredQ: 'c' })).toBe(
      '/api/example/a/test/?requiredQ=c'
    );
    expect(
      construct(
        { required: 'a', optional: 'b' },
        { requiredQ: 'c', optionalQ: 'd' }
      )
    ).toBe('/api/example/a/test/b?optionalQ=d&requiredQ=c');

    // @tsassert: (url: string) => { urlParams: { required: string; } & {} & {} & { optional?: string | undefined; } & {} & {}; queryParams: { requiredQ: string; } & {} & {} & { optionalQ?: string | undefined; } & ... 7 more ... & {}; }
    const deconstruct = url.deconstruct;

    expect(deconstruct('/api/example/a/test?requiredQ=c')).toEqual({
      urlParams: {
        required: 'a',
        optional: undefined,
      },
      queryParams: {
        requiredQ: 'c',
        optionalQ: undefined,
      },
    });
    expect(
      deconstruct('/api/example/a/test/b?requiredQ=c&optionalQ=d')
    ).toEqual({
      urlParams: {
        required: 'a',
        optional: 'b',
      },
      queryParams: {
        requiredQ: 'c',
        optionalQ: 'd',
      },
    });
  });

  it('should handle constructing and deconstructing both required and optional numbers', () => {
    const url = createTSURL(
      [
        '/api/example',
        requiredNumber('required'),
        'test',
        optionalNumber('optional'),
      ],
      {
        queryParams: [requiredNumber('requiredQ'), optionalNumber('optionalQ')],
      }
    );

    // @tsassert: (urlParams: {} & { required: number; } & {} & {} & { optional?: number | undefined; } & {}, queryParams: {} & { requiredQ: number; } & {} & {} & { optionalQ?: number | undefined; } & {} & {} & {} & {} & {} & {} & {}) => string
    const construct = url.construct;

    expect(construct({ required: 1 }, { requiredQ: 3 })).toBe(
      '/api/example/1/test/?requiredQ=3'
    );
    expect(
      construct({ required: 1, optional: 2 }, { requiredQ: 3, optionalQ: 4 })
    ).toBe('/api/example/1/test/2?optionalQ=4&requiredQ=3');

    // @tsassert: (url: string) => { urlParams: {} & { required: number; } & {} & {} & { optional?: number | undefined; } & {}; queryParams: {} & { requiredQ: number; } & {} & {} & { optionalQ?: number | undefined; } & ... 6 more ... & {}; }
    const deconstruct = url.deconstruct;

    expect(deconstruct('/api/example/1/test?requiredQ=3')).toEqual({
      urlParams: {
        required: 1,
        optional: undefined,
      },
      queryParams: {
        requiredQ: 3,
        optionalQ: undefined,
      },
    });
    expect(
      deconstruct('/api/example/1/test/2?requiredQ=3&optionalQ=4')
    ).toEqual({
      urlParams: {
        required: 1,
        optional: 2,
      },
      queryParams: {
        requiredQ: 3,
        optionalQ: 4,
      },
    });
  });

  it('should handle constructing and deconstructing both required and optional booleans', () => {
    const url = createTSURL(
      [
        '/api/example',
        requiredBoolean('required'),
        'test',
        optionalBoolean('optional'),
      ],
      {
        queryParams: [
          requiredBoolean('requiredQ'),
          optionalBoolean('optionalQ'),
        ],
      }
    );

    // @tsassert: (urlParams: {} & {} & { required: boolean; } & {} & {} & { optional?: boolean | undefined; }, queryParams: {} & {} & { requiredQ: boolean; } & {} & {} & { optionalQ?: boolean | undefined; } & {} & {} & {} & {} & {} & {}) => string
    const construct = url.construct;

    expect(construct({ required: true }, { requiredQ: true })).toBe(
      '/api/example/true/test/?requiredQ=true'
    );
    expect(
      construct(
        { required: true, optional: false },
        { requiredQ: true, optionalQ: false }
      )
    ).toBe('/api/example/true/test/false?optionalQ=false&requiredQ=true');

    // @tsassert: (url: string) => { urlParams: {} & {} & { required: boolean; } & {} & {} & { optional?: boolean | undefined; }; queryParams: {} & {} & { requiredQ: boolean; } & {} & {} & { optionalQ?: boolean | undefined; } & ... 5 more ... & {}; }
    const deconstruct = url.deconstruct;

    expect(deconstruct('/api/example/true/test?requiredQ=true')).toEqual({
      urlParams: {
        required: true,
        optional: undefined,
      },
      queryParams: {
        requiredQ: true,
        optionalQ: undefined,
      },
    });
    expect(
      deconstruct('/api/example/true/test/false?requiredQ=true&optionalQ=false')
    ).toEqual({
      urlParams: {
        required: true,
        optional: false,
      },
      queryParams: {
        requiredQ: true,
        optionalQ: false,
      },
    });
  });
});
