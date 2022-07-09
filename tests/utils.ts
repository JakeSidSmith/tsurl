import {
  optionalBoolean,
  optionalBooleanArray,
  optionalNumber,
  optionalNumberArray,
  optionalString,
  optionalStringArray,
  requiredBoolean,
  requiredBooleanArray,
  requiredString,
} from '../src';
import {
  constructPath,
  constructQuery,
  serializeQueryParams,
  serializeURLParams,
  serializeValue,
} from '../src/utils';

describe('serializeValue', () => {
  it('should throw an error if it encounters an unknown value', () => {
    expect(() => serializeValue(optionalNumber('test'), [''])).toThrow(
      'Invalid value for'
    );
    expect(() => serializeValue(requiredBoolean('test'), 'nope')).toThrow(
      'Invalid value for'
    );
    expect(() => serializeValue(optionalBoolean('test'), 'nope')).toThrow(
      'Invalid value for'
    );
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serializeValue(optionalStringArray('test'), null as any)
    ).toThrow('Invalid value for');
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serializeValue(optionalNumberArray('test'), null as any)
    ).toThrow('Invalid value for');
    expect(() =>
      serializeValue(requiredBooleanArray('test'), ['nope'])
    ).toThrow('Invalid value for');
    expect(() =>
      serializeValue(optionalBooleanArray('test'), ['nope'])
    ).toThrow('Invalid value for');
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serializeValue(optionalBooleanArray('test'), null as any)
    ).toThrow('Invalid value for');
  });
});

describe('serializeURLParams', () => {
  it('should throw if a required URL param is undefined', () => {
    expect(() => serializeURLParams({}, [requiredString('test')])).toThrow(
      'was undefined'
    );
  });

  it('should throw if a URL param is null', () => {
    expect(() =>
      serializeURLParams({ test: null }, [optionalString('test')])
    ).toThrow('Invalid null');
  });
});

describe('serializeQueryParams', () => {
  it('should throw if a required query param is undefined', () => {
    expect(() => serializeQueryParams({}, [requiredString('test')])).toThrow(
      'was undefined'
    );
  });

  it('should throw if a query param is null', () => {
    expect(() =>
      serializeQueryParams({ test: null }, [optionalString('test')])
    ).toThrow('Invalid null');
  });
});

describe('constructPath', () => {
  it('should throw if a required URL param is undefined', () => {
    expect(() => constructPath({}, [requiredString('test')], {})).toThrow(
      'not provided'
    );
  });
});

describe('constructQuery', () => {
  it('should throw if a required query param is undefined', () => {
    expect(() => constructQuery({}, [requiredString('test')], {})).toThrow(
      'not provided'
    );
  });
});
