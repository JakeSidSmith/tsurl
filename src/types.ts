import { ParseOptions } from 'query-string';
import {
  OptionalBoolean,
  OptionalBooleanArray,
  OptionalNumber,
  OptionalNumberArray,
  OptionalString,
  OptionalStringArray,
  RequiredBoolean,
  RequiredBooleanArray,
  RequiredNumber,
  RequiredNumberArray,
  RequiredString,
  RequiredStringArray,
} from './params';

export type RequiredPart<T extends string> =
  | RequiredString<T>
  | RequiredNumber<T>
  | RequiredBoolean<T>
  | RequiredStringArray<T>
  | RequiredNumberArray<T>
  | RequiredBooleanArray<T>;

export type OptionalPart<T extends string> =
  | OptionalString<T>
  | OptionalNumber<T>
  | OptionalBoolean<T>
  | OptionalStringArray<T>
  | OptionalNumberArray<T>
  | OptionalBooleanArray<T>;

export type AnyPart<T extends string> = RequiredPart<T> | OptionalPart<T>;

export type URLParamsSchema = ReadonlyArray<
  | string
  | RequiredString<string>
  | RequiredNumber<string>
  | RequiredBoolean<string>
  | OptionalString<string>
  | OptionalNumber<string>
  | OptionalBoolean<string>
>;

export type QueryParamsSchema = ReadonlyArray<
  | RequiredString<string>
  | RequiredNumber<string>
  | RequiredBoolean<string>
  | RequiredStringArray<string>
  | RequiredNumberArray<string>
  | RequiredBooleanArray<string>
  | OptionalString<string>
  | OptionalNumber<string>
  | OptionalBoolean<string>
  | OptionalStringArray<string>
  | OptionalNumberArray<string>
  | OptionalBooleanArray<string>
>;

export interface TSURLOptions<Q extends QueryParamsSchema> {
  protocol?: string | false;
  trailingSlash?: boolean;
  encode?: boolean;
  decode?: boolean;
  normalize?: boolean;
  queryArrayFormat?: ParseOptions['arrayFormat'];
  queryArrayFormatSeparator?: ParseOptions['arrayFormatSeparator'];
  queryParams?: Q;
}
