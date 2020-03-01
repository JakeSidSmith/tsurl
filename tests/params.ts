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
});
