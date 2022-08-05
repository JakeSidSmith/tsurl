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
      queryParams: [],
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
    expect(() => url1.constructPath({} as any, {})).toThrow('not provided');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => url1.constructURL({} as any, {})).toThrow('not provided');
  });

  describe('constructPath', () => {
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
      expect(() => url1.constructPath({} as any, {})).toThrow('not provided');
    });

    it('should not append query params if none are found', () => {
      const url1 = createTSURL(
        ['/api/test/', requiredString('required'), '///end'],
        { trailingSlash: true, queryParams: [optionalString('nope')] }
      );

      expect(url1.constructPath({ required: 'required' }, {})).toBe(
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

      expect(url1.constructPath({ required: 'value' }, {})).toBe(
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

      expect(url1.constructPath({ required: 'value' }, {})).toBe(
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

      expect(
        noSlash.constructPath({ required: 'value', optional: 123 }, {})
      ).toBe('api/test/value/123/end');
    });

    it('should construct a string with unchanged trailing slash when no trailing slash option is provided', () => {
      const noSlash = createTSURL([
        'api//test/',
        requiredString('required'),
        optionalNumber('optional'),
        '///end',
      ]);

      expect(
        noSlash.constructPath({ required: 'value', optional: 123 }, {})
      ).toBe('api/test/value/123/end');

      const withSlash = createTSURL([
        'api//test/',
        requiredString('required'),
        optionalNumber('optional'),
        '///end/',
      ]);

      expect(
        withSlash.constructPath({ required: 'value', optional: 123 }, {})
      ).toBe('api/test/value/123/end/');
    });

    it('should remove leading double slashes when no baseURL option is defined', () => {
      const noBaseURL = createTSURL(['//api//test/']);

      expect(noBaseURL.constructPath({}, {})).toBe('/api/test/');
    });

    it('should encode the url by default', () => {
      const url1 = createTSURL(['test.com/api//test/hello world']);

      expect(url1.constructPath({}, {})).toBe(
        'test.com/api/test/hello%20world'
      );
    });

    it('should not encode the url when the encode option is false', () => {
      const url1 = createTSURL(['test.com/api//test/hello world'], {
        encode: false,
      });

      expect(url1.constructPath({}, {})).toBe('test.com/api/test/hello world');
    });
  });

  describe('constructURL', () => {
    it('should not remove leading double slashes when no baseURL option is defined and normalize is false', () => {
      const noBaseURL = createTSURL(['//api//test/'], { normalize: false });

      expect(noBaseURL.constructURL({}, {})).toBe('//api//test/');
    });

    it('should not remove leading double slashes when baseURL option is defined and normalize is false', () => {
      const withBaseURL = createTSURL(['//api//test/'], {
        baseURL: 'https://test.com/',
        normalize: false,
      });

      expect(withBaseURL.constructURL({}, {})).toBe(
        'https://test.com///api//test/'
      );
    });

    it('should remove leading double slashes when no baseURL option is defined', () => {
      const noBaseURL = createTSURL(['//api//test/']);

      expect(noBaseURL.constructURL({}, {})).toBe('/api/test/');
    });

    it('should remove leading double slashes when baseURL option is defined', () => {
      const withBaseURL = createTSURL(['//api//test/'], {
        baseURL: 'https://test.com//',
      });

      expect(withBaseURL.constructURL({}, {})).toBe(
        'https://test.com/api/test/'
      );
    });

    it('should include the baseURL when that option is provided', () => {
      const url1 = createTSURL(['//api//test/'], {
        baseURL: 'https://test.com/',
      });

      expect(url1.constructURL({}, {})).toBe('https://test.com/api/test/');

      const url2 = createTSURL(['////////api//test/'], {
        baseURL: '//test.com/',
      });

      expect(url2.constructURL({}, {})).toBe('//test.com/api/test/');
    });

    it('should not include the baseURL when that option is not provided', () => {
      const url1 = createTSURL(['//api//test/'], {});

      expect(url1.constructURL({}, {})).toBe('/api/test/');
    });

    it('should include the query params when provided', () => {
      const url = createTSURL(['//api//test/'], {
        baseURL: 'https://test.com/',
        queryParams: [optionalString('optional')],
      });

      expect(url.constructURL({}, {})).toBe('https://test.com/api/test/');
      expect(url.constructURL({}, { optional: 'hello' })).toBe(
        'https://test.com/api/test/?optional=hello'
      );
    });

    it('should allow overriding the default options', () => {
      const url = createTSURL(['/api/test/'], {
        baseURL: 'https://test.com/',
        trailingSlash: true,
      });

      expect(url.constructURL({}, {})).toBe('https://test.com/api/test/');

      expect(
        url.constructURL({}, {}, { baseURL: 'https://override.com/' })
      ).toBe('https://override.com/api/test/');
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

      const urlString1 = url1.constructPath({ required: 'value1' }, {});

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

      const urlString2 = url2.constructPath(
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

      const urlString3 = url3.constructPath(
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

      const urlString4 = url4.constructPath(
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

      const urlString5 = url5.constructPath(
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

  describe('getPathTemplate', () => {
    it('returns a string template representing the path with the path-to-regexp format', () => {
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

      expect(url1.getPathTemplate()).toBe(
        '/api/test/:required/test/:optional?/'
      );

      const url2 = createTSURL(
        [
          '//test/',
          requiredString('required'),
          'test',
          optionalString('optional'),
        ],
        {
          baseURL: 'https://test.com/api/',
          trailingSlash: true,
        }
      );

      expect(url2.getPathTemplate()).toBe('/test/:required/test/:optional?/');
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

      const url2 = createTSURL(
        [
          '//test/',
          requiredString('required'),
          'test',
          optionalString('optional'),
        ],
        {
          baseURL: 'https://test.com/api/',
          trailingSlash: true,
        }
      );

      expect(url2.getURLTemplate()).toBe(
        'https://test.com/api/test/:required/test/:optional?/'
      );
    });
  });
});
