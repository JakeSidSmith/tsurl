import type { ParseOptions } from 'query-string';
import type {
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

export type InferURLParams<S extends URLParamsSchema = readonly never[]> =
  S extends readonly (infer V)[]
    ? {
        [P in V extends RequiredString<infer Name> ? Name : never]: string;
      } & {
        [P in V extends RequiredNumber<infer Name> ? Name : never]: number;
      } & {
        [P in V extends RequiredBoolean<infer Name> ? Name : never]: boolean;
      } & {
        [P in V extends OptionalString<infer Name> ? Name : never]?: string;
      } & {
        [P in V extends OptionalNumber<infer Name> ? Name : never]?: number;
      } & {
        [P in V extends OptionalBoolean<infer Name> ? Name : never]?: boolean;
      }
    : never;

export type InferQueryParams<Q extends QueryParamsSchema = readonly never[]> =
  Q extends readonly (infer V)[]
    ? {
        [P in V extends RequiredString<infer Name> ? Name : never]: string;
      } & {
        [P in V extends RequiredNumber<infer Name> ? Name : never]: number;
      } & {
        [P in V extends RequiredBoolean<infer Name> ? Name : never]: boolean;
      } & {
        [P in V extends OptionalString<infer Name> ? Name : never]?: string;
      } & {
        [P in V extends OptionalNumber<infer Name> ? Name : never]?: number;
      } & {
        [P in V extends OptionalBoolean<infer Name> ? Name : never]?: boolean;
      } & {
        [P in V extends RequiredStringArray<infer Name>
          ? Name
          : never]: readonly string[];
      } & {
        [P in V extends RequiredNumberArray<infer Name>
          ? Name
          : never]: readonly number[];
      } & {
        [P in V extends RequiredBooleanArray<infer Name>
          ? Name
          : never]: readonly boolean[];
      } & {
        [P in V extends OptionalStringArray<infer Name>
          ? Name
          : never]?: readonly string[];
      } & {
        [P in V extends OptionalNumberArray<infer Name>
          ? Name
          : never]?: readonly number[];
      } & {
        [P in V extends OptionalBooleanArray<infer Name>
          ? Name
          : never]?: readonly boolean[];
      }
    : never;
