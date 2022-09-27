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
          : never]: V extends RequiredString<P>
          ? string
          : V extends RequiredNumber<P>
          ? number
          : V extends RequiredBoolean<P>
          ? boolean
          : never;
      } & {
        [P in V extends
          | OptionalString<infer Name>
          | OptionalNumber<infer Name>
          | OptionalBoolean<infer Name>
          | Splat<infer Name>
          ? Name
          : never]?: V extends OptionalString<P>
          ? string
          : V extends OptionalNumber<P>
          ? number
          : V extends OptionalBoolean<P>
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
          : never]: V extends RequiredString<P>
          ? string
          : V extends RequiredNumber<P>
          ? number
          : V extends RequiredBoolean<P>
          ? boolean
          : V extends RequiredStringArray<P>
          ? readonly string[]
          : V extends RequiredNumberArray<P>
          ? readonly number[]
          : V extends RequiredBooleanArray<P>
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
          : never]?: V extends OptionalString<P>
          ? string
          : V extends OptionalNumber<P>
          ? number
          : V extends OptionalBoolean<P>
          ? boolean
          : V extends OptionalStringArray<P>
          ? readonly string[]
          : V extends OptionalNumberArray<P>
          ? readonly number[]
          : V extends OptionalBooleanArray<P>
          ? readonly boolean[]
          : never;
      }
    : never;
