import createTSURL, {
  optionalBoolean,
  optionalBooleanArray,
  optionalEnum,
  optionalEnumArray,
  optionalNumber,
  optionalNumberArray,
  optionalString,
  optionalStringArray,
  requiredBoolean,
  requiredBooleanArray,
  requiredEnum,
  requiredEnumArray,
  requiredNumber,
  requiredNumberArray,
  requiredString,
  requiredStringArray,
} from '../src';

enum TestEnumNumber {
  ONE,
  TWO,
  THREE,
}

enum TestEnumString {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
}

enum TestEnumMixed {
  ONE,
  TWO = 'SECOND',
  THREE = 3,
  FOUR,
  FIVE = 'FIVE',
  SIX = 2.0,
  SEVEN = 2.1,
  EIGHT = '2.0',
  NINE = '2.1',
}

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
        requiredEnum('g1', ['one', 'two', 'three'] as const),
        requiredEnum('g2', TestEnumNumber),
        requiredEnum('g3', TestEnumString),
        requiredEnum('g4', TestEnumMixed),
        requiredEnum('g5', TestEnumMixed),
        requiredEnum('g6', TestEnumMixed),
        requiredEnum('g7', TestEnumMixed),
        optionalEnum('h1', ['one', 'two', 'three'] as const),
        optionalEnum('h2', TestEnumNumber),
        optionalEnum('h3', TestEnumString),
        optionalEnum('h4', TestEnumMixed),
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
          requiredEnum('m', TestEnumMixed),
          optionalEnum('n', TestEnumMixed),
          requiredEnumArray('o1', ['one', 'two', 'three'] as const),
          requiredEnumArray('o2', TestEnumNumber),
          requiredEnumArray('o3', TestEnumString),
          requiredEnumArray('o4', TestEnumMixed),
          optionalEnumArray('p1', ['one', 'two', 'three'] as const),
          optionalEnumArray('p2', TestEnumNumber),
          optionalEnumArray('p3', TestEnumString),
          optionalEnumArray('p4', TestEnumMixed),
        ],
      }
    );

    const urlString =
      '/api/test/a/1/true/false/two/1/THREE/3/2.0/2.1/FIVE' +
      '?a=a&b=1&c1=true&c2=false&g=g1&g=g2&h=1&h=2&i=true&i=false&m=SECOND&o1=one&o1=three&o2=1&o2=2&o3=ONE&o3=THREE&o4=SECOND&o4=4';

    expect(url.deconstruct(urlString)).toEqual({
      urlParams: {
        a: 'a',
        b: 1,
        c1: true,
        c2: false,
        d: undefined,
        e: undefined,
        f: undefined,
        g1: 'two',
        g2: 1,
        g3: 'THREE',
        g4: 3,
        g5: '2.0',
        g6: 2.1,
        g7: 'FIVE',
        h1: undefined,
        h2: undefined,
        h3: undefined,
        h4: undefined,
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
        m: 'SECOND',
        n: undefined,
        o1: ['one', 'three'],
        o2: [1, 2],
        o3: ['ONE', 'THREE'],
        o4: ['SECOND', 4],
        p1: undefined,
        p2: undefined,
        p3: undefined,
        p4: undefined,
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
        requiredEnum('g1', ['one', 'two', 'three'] as const),
        requiredEnum('g2', TestEnumNumber),
        requiredEnum('g3', TestEnumString),
        requiredEnum('g4', TestEnumMixed),
        requiredEnum('g5', TestEnumMixed),
        requiredEnum('g6', TestEnumMixed),
        requiredEnum('g7', TestEnumMixed),
        optionalEnum('h1', ['one', 'two', 'three'] as const),
        optionalEnum('h2', TestEnumNumber),
        optionalEnum('h3', TestEnumString),
        optionalEnum('h4', TestEnumMixed),
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
          requiredEnum('m', TestEnumMixed),
          optionalEnum('n', TestEnumMixed),
          requiredEnumArray('o1', ['one', 'two', 'three'] as const),
          requiredEnumArray('o2', TestEnumNumber),
          requiredEnumArray('o3', TestEnumString),
          requiredEnumArray('o4', TestEnumMixed),
          optionalEnumArray('p1', ['one', 'two', 'three'] as const),
          optionalEnumArray('p2', TestEnumNumber),
          optionalEnumArray('p3', TestEnumString),
          optionalEnumArray('p4', TestEnumMixed),
        ],
      }
    );

    const urlString =
      '/api/test/a/1/true/false/d/2/true/two/1/THREE/3/2.0/2.1/FIVE/two/2/ONE/4' +
      '?a=a&b=1&c1=true&c2=false&d=d&e=2&f1=true&f2=false&g=g1&g=g2&h=1&h=2&i=true&i=false&j=j&k=3&l=false&l=true' +
      '&m=0&n=FIVE&o1=two&o1=three&o2=0&o2=2&' +
      'o3=ONE&o3=THREE&o4=3&o4=2.0&p1=two&p1=three&p2=0&p2=2' +
      '&p3=ONE&p3=THREE&p4=0&p4=SECOND&p4=3&p4=4&p4=FIVE&p4=2.0&p4=2.1';

    expect(url.deconstruct(urlString)).toEqual({
      urlParams: {
        a: 'a',
        b: 1,
        c1: true,
        c2: false,
        d: 'd',
        e: 2,
        f: true,
        g1: 'two',
        g2: 1,
        g3: 'THREE',
        g4: 3,
        g5: '2.0',
        g6: 2.1,
        g7: 'FIVE',
        h1: 'two',
        h2: 2,
        h3: 'ONE',
        h4: 4,
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
        m: 0,
        n: 'FIVE',
        o1: ['two', 'three'],
        o2: [0, 2],
        o3: ['ONE', 'THREE'],
        o4: [3, '2.0'],
        p1: ['two', 'three'],
        p2: [0, 2],
        p3: ['ONE', 'THREE'],
        p4: [0, 'SECOND', 3, 4, 'FIVE', '2.0', 2.1],
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

    // @tsassert: (urlParams: { required: string; } & { optional?: string | undefined; }, queryParams: { requiredQ: string; } & { optionalQ?: string | undefined; }) => string
    const constructPath = url.constructPath;

    expect(constructPath({ required: 'a' }, { requiredQ: 'c' })).toBe(
      '/api/example/a/test/?requiredQ=c'
    );
    expect(
      constructPath(
        { required: 'a', optional: 'b' },
        { requiredQ: 'c', optionalQ: 'd' }
      )
    ).toBe('/api/example/a/test/b?optionalQ=d&requiredQ=c');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: { required: string; } & { optional?: string | undefined; }; queryParams: { requiredQ: string; } & { optionalQ?: string | undefined; }; }
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

    // @tsassert: (urlParams: { required: number; } & { optional?: number | undefined; }, queryParams: { requiredQ: number; } & { optionalQ?: number | undefined; }) => string
    const constructPath = url.constructPath;

    expect(constructPath({ required: 1 }, { requiredQ: 3 })).toBe(
      '/api/example/1/test/?requiredQ=3'
    );
    expect(
      constructPath(
        { required: 1, optional: 2 },
        { requiredQ: 3, optionalQ: 4 }
      )
    ).toBe('/api/example/1/test/2?optionalQ=4&requiredQ=3');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: { required: number; } & { optional?: number | undefined; }; queryParams: { requiredQ: number; } & { optionalQ?: number | undefined; }; }
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

    // @tsassert: (urlParams: { required: boolean; } & { optional?: boolean | undefined; }, queryParams: { requiredQ: boolean; } & { optionalQ?: boolean | undefined; }) => string
    const constructPath = url.constructPath;

    expect(constructPath({ required: true }, { requiredQ: true })).toBe(
      '/api/example/true/test/?requiredQ=true'
    );
    expect(
      constructPath(
        { required: true, optional: false },
        { requiredQ: true, optionalQ: false }
      )
    ).toBe('/api/example/true/test/false?optionalQ=false&requiredQ=true');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: { required: boolean; } & { optional?: boolean | undefined; }; queryParams: { requiredQ: boolean; } & { optionalQ?: boolean | undefined; }; }
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

  it('should handle constructing and deconstructing both required and optional enums (array of values)', () => {
    const url = createTSURL(
      [
        '/api/example',
        requiredEnum('required', ['a', 'b', 'c']),
        'test',
        optionalEnum('optional', ['d', 'e', 'f']),
      ],
      {
        queryParams: [
          requiredEnum('requiredQ', ['a', 'b', 'c']),
          optionalEnum('optionalQ', ['d', 'e', 'f']),
        ],
      }
    );

    // @tsassert: (urlParams: { required: string; } & { optional?: string | undefined; }, queryParams: { requiredQ: string; } & { optionalQ?: string | undefined; }) => string
    const constructPath = url.constructPath;

    expect(constructPath({ required: 'a' }, { requiredQ: 'b' })).toBe(
      '/api/example/a/test/?requiredQ=b'
    );
    expect(
      constructPath(
        { required: 'a', optional: 'e' },
        { requiredQ: 'b', optionalQ: 'f' }
      )
    ).toBe('/api/example/a/test/e?optionalQ=f&requiredQ=b');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: { required: string; } & { optional?: string | undefined; }; queryParams: { requiredQ: string; } & { optionalQ?: string | undefined; }; }
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
      deconstruct('/api/example/a/test/e?requiredQ=c&optionalQ=d')
    ).toEqual({
      urlParams: {
        required: 'a',
        optional: 'e',
      },
      queryParams: {
        requiredQ: 'c',
        optionalQ: 'd',
      },
    });
  });

  it('should handle constructing and deconstructing both required and optional enums (enum)', () => {
    const url = createTSURL(
      [
        '/api/example',
        requiredEnum('required', TestEnumMixed),
        'test',
        optionalEnum('optional', TestEnumMixed),
      ],
      {
        queryParams: [
          requiredEnum('requiredQ', TestEnumMixed),
          optionalEnum('optionalQ', TestEnumMixed),
        ],
      }
    );

    // @tsassert: (urlParams: { required: TestEnumMixed; } & { optional?: TestEnumMixed | undefined; }, queryParams: { requiredQ: TestEnumMixed; } & { optionalQ?: TestEnumMixed | undefined; }) => string
    const constructPath = url.constructPath;

    expect(
      constructPath(
        { required: TestEnumMixed.ONE },
        { requiredQ: TestEnumMixed.TWO }
      )
    ).toBe('/api/example/0/test/?requiredQ=SECOND');
    expect(
      constructPath(
        { required: TestEnumMixed.THREE, optional: TestEnumMixed.FIVE },
        { requiredQ: TestEnumMixed.TWO, optionalQ: TestEnumMixed.SEVEN }
      )
    ).toBe('/api/example/3/test/FIVE?optionalQ=2.1&requiredQ=SECOND');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: { required: TestEnumMixed; } & { optional?: TestEnumMixed | undefined; }; queryParams: { requiredQ: TestEnumMixed; } & { optionalQ?: TestEnumMixed | undefined; }; }
    const deconstruct = url.deconstruct;

    expect(deconstruct('/api/example/SECOND/test?requiredQ=4')).toEqual({
      urlParams: {
        required: TestEnumMixed.TWO,
        optional: undefined,
      },
      queryParams: {
        requiredQ: TestEnumMixed.FOUR,
        optionalQ: undefined,
      },
    });
    expect(
      deconstruct('/api/example/2.1/test/4?requiredQ=SECOND&optionalQ=0')
    ).toEqual({
      urlParams: {
        required: 2.1,
        optional: 4,
      },
      queryParams: {
        requiredQ: 'SECOND',
        optionalQ: 0,
      },
    });
  });

  it('should handle constructing and deconstructing both required and optional string arrays', () => {
    const url1 = createTSURL(['/api/example'], {
      queryParams: [
        requiredStringArray('requiredQ'),
        optionalStringArray('optionalQ'),
      ],
    });

    // @tsassert: (urlParams: {} & {}, queryParams: { requiredQ: readonly string[]; } & { optionalQ?: readonly string[] | undefined; }) => string
    const constructPath1 = url1.constructPath;

    expect(constructPath1({}, { requiredQ: ['a', 'b'] })).toBe(
      '/api/example?requiredQ=a&requiredQ=b'
    );
    expect(
      constructPath1({}, { requiredQ: ['a', 'b'], optionalQ: ['c', 'd'] })
    ).toBe('/api/example?optionalQ=c&optionalQ=d&requiredQ=a&requiredQ=b');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: {} & {}; queryParams: { requiredQ: readonly string[]; } & { optionalQ?: readonly string[] | undefined; }; }
    const deconstruct1 = url1.deconstruct;

    expect(deconstruct1('/api/example?requiredQ=a&requiredQ=b')).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: ['a', 'b'],
        optionalQ: undefined,
      },
    });
    expect(
      deconstruct1(
        '/api/example?requiredQ=a&requiredQ=b&optionalQ=c&optionalQ=d'
      )
    ).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: ['a', 'b'],
        optionalQ: ['c', 'd'],
      },
    });

    const url2 = createTSURL(['/api/example'], {
      queryParams: [
        requiredStringArray('requiredQ'),
        optionalStringArray('optionalQ'),
      ],
      queryArrayFormat: 'comma',
    });

    // @tsassert: (urlParams: {} & {}, queryParams: { requiredQ: readonly string[]; } & { optionalQ?: readonly string[] | undefined; }) => string
    const constructPath2 = url2.constructPath;

    expect(constructPath2({}, { requiredQ: ['a', 'b'] })).toBe(
      '/api/example?requiredQ=a,b'
    );
    expect(
      constructPath2({}, { requiredQ: ['a', 'b'], optionalQ: ['c', 'd'] })
    ).toBe('/api/example?optionalQ=c,d&requiredQ=a,b');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: {} & {}; queryParams: { requiredQ: readonly string[]; } & { optionalQ?: readonly string[] | undefined; }; }
    const deconstruct2 = url2.deconstruct;

    expect(deconstruct2('/api/example?requiredQ=a,b')).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: ['a', 'b'],
        optionalQ: undefined,
      },
    });
    expect(deconstruct2('/api/example?requiredQ=a,b&optionalQ=c,d')).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: ['a', 'b'],
        optionalQ: ['c', 'd'],
      },
    });
  });

  it('should handle constructing and deconstructing both required and optional number arrays', () => {
    const url1 = createTSURL(['/api/example'], {
      queryParams: [
        requiredNumberArray('requiredQ'),
        optionalNumberArray('optionalQ'),
      ],
    });

    // @tsassert: (urlParams: {} & {}, queryParams: { requiredQ: readonly number[]; } & { optionalQ?: readonly number[] | undefined; }) => string
    const constructPath1 = url1.constructPath;

    expect(constructPath1({}, { requiredQ: [1, 2] })).toBe(
      '/api/example?requiredQ=1&requiredQ=2'
    );
    expect(constructPath1({}, { requiredQ: [1, 2], optionalQ: [3, 4] })).toBe(
      '/api/example?optionalQ=3&optionalQ=4&requiredQ=1&requiredQ=2'
    );

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: {} & {}; queryParams: { requiredQ: readonly number[]; } & { optionalQ?: readonly number[] | undefined; }; }
    const deconstruct1 = url1.deconstruct;

    expect(deconstruct1('/api/example?requiredQ=1&requiredQ=2')).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: [1, 2],
        optionalQ: undefined,
      },
    });
    expect(
      deconstruct1(
        '/api/example?requiredQ=1&requiredQ=2&optionalQ=3&optionalQ=4'
      )
    ).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: [1, 2],
        optionalQ: [3, 4],
      },
    });

    const url2 = createTSURL(['/api/example'], {
      queryParams: [
        requiredNumberArray('requiredQ'),
        optionalNumberArray('optionalQ'),
      ],
      queryArrayFormat: 'comma',
    });

    // @tsassert: (urlParams: {} & {}, queryParams: { requiredQ: readonly number[]; } & { optionalQ?: readonly number[] | undefined; }) => string
    const constructPath2 = url2.constructPath;

    expect(constructPath2({}, { requiredQ: [1, 2] })).toBe(
      '/api/example?requiredQ=1,2'
    );
    expect(constructPath2({}, { requiredQ: [1, 2], optionalQ: [3, 4] })).toBe(
      '/api/example?optionalQ=3,4&requiredQ=1,2'
    );

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: {} & {}; queryParams: { requiredQ: readonly number[]; } & { optionalQ?: readonly number[] | undefined; }; }
    const deconstruct2 = url2.deconstruct;

    expect(deconstruct2('/api/example?requiredQ=1,2')).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: [1, 2],
        optionalQ: undefined,
      },
    });
    expect(deconstruct2('/api/example?requiredQ=1,2&optionalQ=3,4')).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: [1, 2],
        optionalQ: [3, 4],
      },
    });
  });

  it('should handle constructing and deconstructing both required and optional boolean arrays', () => {
    const url1 = createTSURL(['/api/example'], {
      queryParams: [
        requiredBooleanArray('requiredQ'),
        optionalBooleanArray('optionalQ'),
      ],
    });

    // @tsassert: (urlParams: {} & {}, queryParams: { requiredQ: readonly boolean[]; } & { optionalQ?: readonly boolean[] | undefined; }) => string
    const constructPath1 = url1.constructPath;

    expect(constructPath1({}, { requiredQ: [true, false] })).toBe(
      '/api/example?requiredQ=true&requiredQ=false'
    );
    expect(
      constructPath1({}, { requiredQ: [true, false], optionalQ: [true, false] })
    ).toBe(
      '/api/example?optionalQ=true&optionalQ=false&requiredQ=true&requiredQ=false'
    );

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: {} & {}; queryParams: { requiredQ: readonly boolean[]; } & { optionalQ?: readonly boolean[] | undefined; }; }
    const deconstruct1 = url1.deconstruct;

    expect(deconstruct1('/api/example?requiredQ=true&requiredQ=false')).toEqual(
      {
        urlParams: {},
        queryParams: {
          requiredQ: [true, false],
          optionalQ: undefined,
        },
      }
    );
    expect(
      deconstruct1(
        '/api/example?requiredQ=true&requiredQ=false&optionalQ=true&optionalQ=false'
      )
    ).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: [true, false],
        optionalQ: [true, false],
      },
    });

    const url2 = createTSURL(['/api/example'], {
      queryParams: [
        requiredBooleanArray('requiredQ'),
        optionalBooleanArray('optionalQ'),
      ],
      queryArrayFormat: 'comma',
    });

    // @tsassert: (urlParams: {} & {}, queryParams: { requiredQ: readonly boolean[]; } & { optionalQ?: readonly boolean[] | undefined; }) => string
    const constructPath2 = url2.constructPath;

    expect(constructPath2({}, { requiredQ: [true, false] })).toBe(
      '/api/example?requiredQ=true,false'
    );
    expect(
      constructPath2({}, { requiredQ: [true, false], optionalQ: [true, false] })
    ).toBe('/api/example?optionalQ=true,false&requiredQ=true,false');

    // @tsassert: (url: string, deconstructOptions?: DeconstructOptions | undefined) => { urlParams: {} & {}; queryParams: { requiredQ: readonly boolean[]; } & { optionalQ?: readonly boolean[] | undefined; }; }
    const deconstruct2 = url2.deconstruct;

    expect(deconstruct2('/api/example?requiredQ=true,false')).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: [true, false],
        optionalQ: undefined,
      },
    });
    expect(
      deconstruct2('/api/example?requiredQ=true,false&optionalQ=true,false')
    ).toEqual({
      urlParams: {},
      queryParams: {
        requiredQ: [true, false],
        optionalQ: [true, false],
      },
    });
  });
});
