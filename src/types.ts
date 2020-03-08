import { ParseOptions } from 'query-string';

import * as SYMBOLS from './symbols';

export interface RequiredString<T extends string> {
  type: typeof SYMBOLS.REQUIRED_STRING;
  name: T;
}
export interface RequiredNumber<T extends string> {
  type: typeof SYMBOLS.REQUIRED_NUMBER;
  name: T;
}
export interface RequiredBoolean<T extends string> {
  type: typeof SYMBOLS.REQUIRED_BOOLEAN;
  name: T;
}
export interface RequiredStringArray<T extends string> {
  type: typeof SYMBOLS.REQUIRED_STRING_ARRAY;
  name: T;
}
export interface RequiredNumberArray<T extends string> {
  type: typeof SYMBOLS.REQUIRED_NUMBER_ARRAY;
  name: T;
}
export interface RequiredBooleanArray<T extends string> {
  type: typeof SYMBOLS.REQUIRED_BOOLEAN_ARRAY;
  name: T;
}

export type RequiredPart<T extends string> =
  | RequiredString<T>
  | RequiredNumber<T>
  | RequiredBoolean<T>
  | RequiredStringArray<T>
  | RequiredNumberArray<T>
  | RequiredBooleanArray<T>;

export interface OptionalString<T extends string> {
  type: typeof SYMBOLS.OPTIONAL_STRING;
  name: T;
}
export interface OptionalNumber<T extends string> {
  type: typeof SYMBOLS.OPTIONAL_NUMBER;
  name: T;
}
export interface OptionalBoolean<T extends string> {
  type: typeof SYMBOLS.OPTIONAL_BOOLEAN;
  name: T;
}
export interface OptionalStringArray<T extends string> {
  type: typeof SYMBOLS.OPTIONAL_STRING_ARRAY;
  name: T;
}
export interface OptionalNumberArray<T extends string> {
  type: typeof SYMBOLS.OPTIONAL_NUMBER_ARRAY;
  name: T;
}
export interface OptionalBooleanArray<T extends string> {
  type: typeof SYMBOLS.OPTIONAL_BOOLEAN_ARRAY;
  name: T;
}

export type OptionalPart<T extends string> =
  | OptionalString<T>
  | OptionalNumber<T>
  | OptionalBoolean<T>
  | OptionalStringArray<T>
  | OptionalNumberArray<T>
  | OptionalBooleanArray<T>;

export type AnyPart<T extends string> = RequiredPart<T> | OptionalPart<T>;

export type URLParamsSchema<
  RequiredStringURLKeys extends string,
  RequiredNumberURLKeys extends string,
  RequiredBooleanURLKeys extends string,
  OptionalStringURLKeys extends string,
  OptionalNumberURLKeys extends string,
  OptionalBooleanURLKeys extends string
> = ReadonlyArray<
  | string
  | RequiredString<RequiredStringURLKeys>
  | RequiredNumber<RequiredNumberURLKeys>
  | RequiredBoolean<RequiredBooleanURLKeys>
  | OptionalString<OptionalStringURLKeys>
  | OptionalNumber<OptionalNumberURLKeys>
  | OptionalBoolean<OptionalBooleanURLKeys>
>;

export type QueryParamsSchema<
  RequiredStringQueryKeys extends string,
  RequiredNumberQueryKeys extends string,
  RequiredBooleanQueryKeys extends string,
  RequiredStringArrayQueryKeys extends string,
  RequiredNumberArrayQueryKeys extends string,
  RequiredBooleanArrayQueryKeys extends string,
  OptionalStringQueryKeys extends string,
  OptionalNumberQueryKeys extends string,
  OptionalBooleanQueryKeys extends string,
  OptionalStringArrayQueryKeys extends string,
  OptionalNumberArrayQueryKeys extends string,
  OptionalBooleanArrayQueryKeys extends string
> = ReadonlyArray<
  | RequiredString<RequiredStringQueryKeys>
  | RequiredNumber<RequiredNumberQueryKeys>
  | RequiredBoolean<RequiredBooleanQueryKeys>
  | RequiredStringArray<RequiredStringArrayQueryKeys>
  | RequiredNumberArray<RequiredNumberArrayQueryKeys>
  | RequiredBooleanArray<RequiredBooleanArrayQueryKeys>
  | OptionalString<OptionalStringQueryKeys>
  | OptionalNumber<OptionalNumberQueryKeys>
  | OptionalBoolean<OptionalBooleanQueryKeys>
  | OptionalStringArray<OptionalStringArrayQueryKeys>
  | OptionalNumberArray<OptionalNumberArrayQueryKeys>
  | OptionalBooleanArray<OptionalBooleanArrayQueryKeys>
>;

export interface TSURLOptions<
  RequiredStringQueryKeys extends string = never,
  RequiredNumberQueryKeys extends string = never,
  RequiredBooleanQueryKeys extends string = never,
  RequiredStringArrayQueryKeys extends string = never,
  RequiredNumberArrayQueryKeys extends string = never,
  RequiredBooleanArrayQueryKeys extends string = never,
  OptionalStringQueryKeys extends string = never,
  OptionalNumberQueryKeys extends string = never,
  OptionalBooleanQueryKeys extends string = never,
  OptionalStringArrayQueryKeys extends string = never,
  OptionalNumberArrayQueryKeys extends string = never,
  OptionalBooleanArrayQueryKeys extends string = never
> {
  protocol?: string | false;
  trailingSlash?: boolean;
  encode?: boolean;
  decode?: boolean;
  normalize?: boolean;
  queryArrayFormat?: ParseOptions['arrayFormat'];
  queryArrayFormatSeparator?: ParseOptions['arrayFormatSeparator'];
  queryParams?: QueryParamsSchema<
    RequiredStringQueryKeys,
    RequiredNumberQueryKeys,
    RequiredBooleanQueryKeys,
    RequiredStringArrayQueryKeys,
    RequiredNumberArrayQueryKeys,
    RequiredBooleanArrayQueryKeys,
    OptionalStringQueryKeys,
    OptionalNumberQueryKeys,
    OptionalBooleanQueryKeys,
    OptionalStringArrayQueryKeys,
    OptionalNumberArrayQueryKeys,
    OptionalBooleanArrayQueryKeys
  >;
}
