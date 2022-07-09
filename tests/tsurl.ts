import createTSURL, {
  optionalNumber,
  optionalString,
  requiredNumber,
  requiredString,
  TSURL,
} from '../src';

describe('TSURL', () => {
  it('should have some default options', () => {
    const instance = new TSURL([]);

    expect(instance['options']).toEqual({
      encode: true,
      decode: true,
      normalize: true,
      queryArrayFormatSeparator: ',',
    });
  });

  it('should throw if required url params are not provided', () => {
    const url1 = new TSURL(
      [
        '/api/test/',
        requiredString('required'),
        optionalString('optional'),
        '///end',
      ],
      { trailingSlash: true }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => url1.construct({} as any, {})).toThrow('not provided');
  });

  describe('construct', () => {
    it('should throw if required url params are not provided', () => {
      const url1 = createTSURL(
        [
          '/api/test/',
          requiredString('required'),
          optionalString('optional'),
          '///end',
        ],
        { trailingSlash: true }
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => url1.construct({} as any, {})).toThrow('not provided');
    });

    it('should not append query params if none are found', () => {
      const url1 = createTSURL(
        ['/api/test/', requiredString('required'), '///end'],
        { trailingSlash: true, queryParams: [optionalString('nope')] }
      );

      expect(url1.construct({ required: 'required' }, {})).toBe(
        '/api/test/required/end/'
      );
    });

    it('should not normalize the url when the normalize option is false', () => {
      const url1 = createTSURL(
        [
          '/api/test/',
          requiredString('required'),
          optionalString('optional'),
          '/end',
        ],
        { normalize: false }
      );

      expect(url1.construct({ required: 'value' }, {})).toBe(
        '/api/test//value///end'
      );
    });

    it('should construct a string with a trailing slash when the trailing slash option is true', () => {
      const url1 = createTSURL(
        [
          '/api/test/',
          requiredString('required'),
          optionalString('optional'),
          '///end',
        ],
        { trailingSlash: true }
      );

      expect(url1.construct({ required: 'value' }, {})).toBe(
        '/api/test/value/end/'
      );
    });

    it('should construct a string without a trailing slash when the trailing option is false', () => {
      const noSlash = createTSURL(
        [
          'api//test/',
          requiredString('required'),
          optionalNumber('optional'),
          '///end',
        ],
        { trailingSlash: false }
      );

      expect(noSlash.construct({ required: 'value', optional: 123 }, {})).toBe(
        'api/test/value/123/end'
      );
    });

    it('should construct a string with unchanged trailing slash when no trailing slash option is provided', () => {
      const noSlash = createTSURL([
        'api//test/',
        requiredString('required'),
        optionalNumber('optional'),
        '///end',
      ]);

      expect(noSlash.construct({ required: 'value', optional: 123 }, {})).toBe(
        'api/test/value/123/end'
      );

      const withSlash = createTSURL([
        'api//test/',
        requiredString('required'),
        optionalNumber('optional'),
        '///end/',
      ]);

      expect(
        withSlash.construct({ required: 'value', optional: 123 }, {})
      ).toBe('api/test/value/123/end/');
    });

    it('should remove leading double slashes when no protocol option is defined', () => {
      const noProtocol = createTSURL(['//api//test/']);

      expect(noProtocol.construct({}, {})).toBe('/api/test/');
    });

    it('should replace the protocol when protocol option is provided', () => {
      const url1 = createTSURL(['//test.com/api//test/'], {
        protocol: 'https://',
      });

      expect(url1.construct({}, {})).toBe('https://test.com/api/test/');

      const url2 = createTSURL(['http://test.com/api//test/'], {
        protocol: 'https://',
      });

      expect(url2.construct({}, {})).toBe('https://test.com/api/test/');

      const url3 = createTSURL(['dns:test.com/api//test/'], {
        protocol: 'https://',
      });

      expect(url3.construct({}, {})).toBe('https://test.com/api/test/');

      const url4 = createTSURL(['////////test.com/api//test/'], {
        protocol: '//',
      });

      expect(url4.construct({}, {})).toBe('//test.com/api/test/');
    });

    it('should add a protocol when protocol option is provided', () => {
      const url1 = createTSURL(['test.com/api//test/'], {
        protocol: 'https://',
      });

      expect(url1.construct({}, {})).toBe('https://test.com/api/test/');
    });

    it('should remove the protocol when protocol option is false', () => {
      const url1 = createTSURL(['https://test.com/api//test/'], {
        protocol: false,
      });

      expect(url1.construct({}, {})).toBe('test.com/api/test/');
    });

    it('should encode the url by default', () => {
      const url1 = createTSURL(['test.com/api//test/hello world']);

      expect(url1.construct({}, {})).toBe('test.com/api/test/hello%20world');
    });

    it('should not encode the url when the encode option is false', () => {
      const url1 = createTSURL(['test.com/api//test/hello world'], {
        encode: false,
      });

      expect(url1.construct({}, {})).toBe('test.com/api/test/hello world');
    });
  });

  describe('deconstruct', () => {
    it('returns an object containing the params from the real url', () => {
      const url1 = createTSURL([
        '/api//test/',
        requiredString('required'),
        'test',
        optionalString('optional'),
      ]);

      const urlString1 = url1.construct({ required: 'value1' }, {});

      expect(url1.deconstruct(urlString1)).toEqual({
        urlParams: {
          required: 'value1',
        },
        queryParams: {},
      });

      const url2 = createTSURL([
        '/api//test/',
        requiredString('required'),
        'test',
        optionalString('optional'),
      ]);

      const urlString2 = url2.construct(
        { required: 'value1', optional: 'value2' },
        {}
      );

      expect(url2.deconstruct(urlString2)).toEqual({
        urlParams: {
          required: 'value1',
          optional: 'value2',
        },
        queryParams: {},
      });

      const url3 = createTSURL(
        [
          '/api//test/',
          requiredString('required'),
          'test',
          optionalString('optional'),
        ],
        {
          queryParams: [requiredString('required'), optionalString('optional')],
        }
      );

      const urlString3 = url3.construct(
        { required: 'value1', optional: 'value2' },
        { required: 'value3' }
      );

      expect(url3.deconstruct(urlString3)).toEqual({
        urlParams: {
          required: 'value1',
          optional: 'value2',
        },
        queryParams: {
          required: 'value3',
        },
      });

      const url4 = createTSURL(
        [
          '/api//test/',
          requiredString('required'),
          'test',
          optionalString('optional'),
        ],
        {
          queryParams: [requiredString('required'), optionalString('optional')],
        }
      );

      const urlString4 = url4.construct(
        { required: 'value1', optional: 'value2' },
        { required: 'value3', optional: 'value4' }
      );

      expect(url4.deconstruct(urlString4)).toEqual({
        urlParams: {
          required: 'value1',
          optional: 'value2',
        },
        queryParams: {
          required: 'value3',
          optional: 'value4',
        },
      });

      const url5 = createTSURL(
        [
          '/api//test/',
          requiredNumber('required'),
          'test',
          optionalNumber('optional'),
        ],
        {
          queryParams: [requiredNumber('required'), optionalNumber('optional')],
        }
      );

      const urlString5 = url5.construct(
        { required: 1, optional: 2 },
        { required: 3, optional: 4 }
      );

      expect(url5.deconstruct(urlString5)).toEqual({
        urlParams: {
          required: 1,
          optional: 2,
        },
        queryParams: {
          required: 3,
          optional: 4,
        },
      });

      const url6 = createTSURL([
        '/api//test/',
        requiredString('required'),
        'test',
        optionalString('optional'),
      ]);

      expect(() => url6.deconstruct('')).toThrow('was invalid');
    });

    it('should decode URLs by default', () => {
      const url = createTSURL(['/api/test/', requiredString('required')], {
        trailingSlash: true,
        queryParams: [requiredString('required')],
      });

      expect(
        url.deconstruct('/api/test/Hello%20World/?required=Goodbye%20World')
      ).toEqual({
        urlParams: {
          required: 'Hello World',
        },
        queryParams: {
          required: 'Goodbye World',
        },
      });
    });

    it('should not decode URLs when decode option is false', () => {
      const url = createTSURL(['/api/test/', requiredString('required')], {
        decode: false,
        trailingSlash: true,
        queryParams: [requiredString('required')],
      });

      expect(
        url.deconstruct('/api/test/Hello%20World/?required=Goodbye%20World')
      ).toEqual({
        urlParams: {
          required: 'Hello%20World',
        },
        queryParams: {
          required: 'Goodbye%20World',
        },
      });
    });
  });

  describe('getURLTemplate', () => {
    it('returns a string template representing the URL with the path-to-regexp format', () => {
      const url1 = createTSURL(
        [
          '/api//test/',
          requiredString('required'),
          'test',
          optionalString('optional'),
        ],
        {
          trailingSlash: true,
        }
      );

      expect(url1.getURLTemplate()).toBe(
        '/api/test/:required/test/:optional?/'
      );
    });
  });
});
