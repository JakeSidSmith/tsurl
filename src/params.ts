import * as SYMBOLS from './symbols';
import * as TYPES from './types';

export const requiredString = <T extends string>(
  name: T
): TYPES.RequiredString<T> => ({
  type: SYMBOLS.REQUIRED_STRING,
  name,
});
export const requiredNumber = <T extends string>(
  name: T
): TYPES.RequiredNumber<T> => ({
  type: SYMBOLS.REQUIRED_NUMBER,
  name,
});
export const requiredBoolean = <T extends string>(
  name: T
): TYPES.RequiredBoolean<T> => ({
  type: SYMBOLS.REQUIRED_BOOLEAN,
  name,
});
export const requiredStringArray = <T extends string>(
  name: T
): TYPES.RequiredStringArray<T> => ({
  type: SYMBOLS.REQUIRED_STRING_ARRAY,
  name,
});
export const requiredNumberArray = <T extends string>(
  name: T
): TYPES.RequiredNumberArray<T> => ({
  type: SYMBOLS.REQUIRED_NUMBER_ARRAY,
  name,
});
export const requiredBooleanArray = <T extends string>(
  name: T
): TYPES.RequiredBooleanArray<T> => ({
  type: SYMBOLS.REQUIRED_BOOLEAN_ARRAY,
  name,
});

export const optionalString = <T extends string>(
  name: T
): TYPES.OptionalString<T> => ({
  type: SYMBOLS.OPTIONAL_STRING,
  name,
});
export const optionalNumber = <T extends string>(
  name: T
): TYPES.OptionalNumber<T> => ({
  type: SYMBOLS.OPTIONAL_NUMBER,
  name,
});
export const optionalBoolean = <T extends string>(
  name: T
): TYPES.OptionalBoolean<T> => ({
  type: SYMBOLS.OPTIONAL_BOOLEAN,
  name,
});
export const optionalStringArray = <T extends string>(
  name: T
): TYPES.OptionalStringArray<T> => ({
  type: SYMBOLS.OPTIONAL_STRING_ARRAY,
  name,
});
export const optionalNumberArray = <T extends string>(
  name: T
): TYPES.OptionalNumberArray<T> => ({
  type: SYMBOLS.OPTIONAL_NUMBER_ARRAY,
  name,
});
export const optionalBooleanArray = <T extends string>(
  name: T
): TYPES.OptionalBooleanArray<T> => ({
  type: SYMBOLS.OPTIONAL_BOOLEAN_ARRAY,
  name,
});
