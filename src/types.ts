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
  Splat,
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

export type AnyPart<T extends string> =
  | RequiredPart<T>
  | OptionalPart<T>
  | Splat<T>;

export type URLParamsSchema = readonly (
  | string
  | RequiredString<string>
  | RequiredNumber<string>
  | RequiredBoolean<string>
  | OptionalString<string>
  | OptionalNumber<string>
  | OptionalBoolean<string>
  | Splat<string>
)[];

export type QueryParamsSchema = readonly (
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
)[];

export interface TSURLOptions<Q extends QueryParamsSchema> {
  baseURL?: string;
  basePath?: string | readonly string[];
  trailingSlash?: boolean;
  encode?: boolean;
  decode?: boolean;
  normalize?: boolean;
  queryArrayFormat?: ParseOptions['arrayFormat'];
  queryArrayFormatSeparator?: ParseOptions['arrayFormatSeparator'];
  queryParams?: Q;
}

export interface DeconstructOptions {
  allowSubPaths?: boolean;
}

export type InferURLParams<S extends URLParamsSchema = readonly never[]> =
  S extends readonly (infer V)[]
    ? {
        [P in V extends
          | RequiredString<infer Name>
          | RequiredNumber<infer Name>
          | RequiredBoolean<infer Name>
          ? Name
          : never]: V extends RequiredString<string>
          ? string
          : V extends RequiredNumber<string>
          ? number
          : V extends RequiredBoolean<string>
          ? boolean
          : never;
      } & {
        [P in V extends
          | OptionalString<infer Name>
          | OptionalNumber<infer Name>
          | OptionalBoolean<infer Name>
          | Splat<infer Name>
          ? Name
          : never]?: V extends OptionalString<string>
          ? string
          : V extends OptionalNumber<string>
          ? number
          : V extends OptionalBoolean<string>
          ? boolean
          : V extends Splat<string>
          ? readonly string[]
          : never;
      }
    : never;

export type InferQueryParams<Q extends QueryParamsSchema = readonly never[]> =
  Q extends readonly (infer V)[]
    ? {
        [P in V extends
          | RequiredString<infer Name>
          | RequiredNumber<infer Name>
          | RequiredBoolean<infer Name>
          | RequiredStringArray<infer Name>
          | RequiredNumberArray<infer Name>
          | RequiredBooleanArray<infer Name>
          ? Name
          : never]: V extends RequiredString<string>
          ? string
          : V extends RequiredNumber<string>
          ? number
          : V extends RequiredBoolean<string>
          ? boolean
          : V extends RequiredStringArray<string>
          ? readonly string[]
          : V extends RequiredNumberArray<string>
          ? readonly number[]
          : V extends RequiredBooleanArray<string>
          ? readonly boolean[]
          : never;
      } & {
        [P in V extends
          | OptionalString<infer Name>
          | OptionalNumber<infer Name>
          | OptionalBoolean<infer Name>
          | OptionalStringArray<infer Name>
          | OptionalNumberArray<infer Name>
          | OptionalBooleanArray<infer Name>
          ? Name
          : never]?: V extends OptionalString<string>
          ? string
          : V extends OptionalNumber<string>
          ? number
          : V extends OptionalBoolean<string>
          ? boolean
          : V extends OptionalStringArray<string>
          ? readonly string[]
          : V extends OptionalNumberArray<string>
          ? readonly number[]
          : V extends OptionalBooleanArray<string>
          ? readonly boolean[]
          : never;
      }
    : never;
