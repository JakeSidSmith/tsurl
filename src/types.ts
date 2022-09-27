import type { ParseOptions } from 'query-string';
import type {
  OptionalBoolean,
  OptionalBooleanArray,
  // OptionalEnum,
  // OptionalEnumArray,
  OptionalNumber,
  OptionalNumberArray,
  OptionalString,
  OptionalStringArray,
  RequiredBoolean,
  RequiredBooleanArray,
  RequiredEnum,
  // RequiredEnumArray,
  RequiredNumber,
  RequiredNumberArray,
  RequiredString,
  RequiredStringArray,
  Splat,
} from './params';

export type EnumValue = string | number;

export type EnumLike<T extends EnumValue, T2 extends EnumValue> = {
  [P in T]: T2;
};

export type RequiredPart<T extends string> =
  | RequiredString<T>
  | RequiredNumber<T>
  | RequiredBoolean<T>
  | RequiredEnum<T, EnumValue>
  | RequiredStringArray<T>
  | RequiredNumberArray<T>
  | RequiredBooleanArray<T>;
// | RequiredEnumArray<T, EnumValue>;

export type OptionalPart<T extends string> =
  | OptionalString<T>
  | OptionalNumber<T>
  | OptionalBoolean<T>
  // | OptionalEnum<T, EnumValue>
  | OptionalStringArray<T>
  | OptionalNumberArray<T>
  | OptionalBooleanArray<T>;
// | OptionalEnumArray<T, EnumValue>;

export type AnyPart<T extends string> =
  | RequiredPart<T>
  | OptionalPart<T>
  | Splat<T>;

export type URLParamsSchema = readonly (
  | string
  | RequiredString<string>
  | RequiredNumber<string>
  | RequiredBoolean<string>
  | RequiredEnum<string, EnumValue>
  | OptionalString<string>
  | OptionalNumber<string>
  | OptionalBoolean<string>
  // | OptionalEnum<string, any>
  | Splat<string>
)[];

export type QueryParamsSchema = readonly (
  | RequiredString<string>
  | RequiredNumber<string>
  | RequiredBoolean<string>
  | RequiredEnum<string, EnumValue>
  | RequiredStringArray<string>
  | RequiredNumberArray<string>
  | RequiredBooleanArray<string>
  // | RequiredEnumArray<string, EnumValue>
  | OptionalString<string>
  | OptionalNumber<string>
  | OptionalBoolean<string>
  // | OptionalEnum<string, EnumValue>
  | OptionalStringArray<string>
  | OptionalNumberArray<string>
  | OptionalBooleanArray<string>
)[];
// | OptionalEnumArray<string, EnumValue>

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
          | RequiredEnum<infer Name, EnumValue>
          ? Name
          : never]: V extends RequiredString<P>
          ? string
          : V extends RequiredNumber<P>
          ? number
          : V extends RequiredBoolean<P>
          ? boolean
          : V extends RequiredEnum<P, infer Value>
          ? Value
          : never;
      } & {
        [P in V extends
          | OptionalString<infer Name>
          | OptionalNumber<infer Name>
          | OptionalBoolean<infer Name>
          // | OptionalEnum<infer Name, any>
          | Splat<infer Name>
          ? Name
          : never]?: V extends OptionalString<P>
          ? string
          : V extends OptionalNumber<P>
          ? number
          : V extends OptionalBoolean<P>
          ? boolean
          : // : V extends OptionalEnum<P, infer Value>
          // ? InferEnumOrArrayValue<Value>
          V extends Splat<P>
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
          | RequiredEnum<infer Name, EnumValue>
          | RequiredStringArray<infer Name>
          | RequiredNumberArray<infer Name>
          | RequiredBooleanArray<infer Name>
          ? // | RequiredEnumArray<infer Name, any>
            Name
          : never]: V extends RequiredString<P>
          ? string
          : V extends RequiredNumber<P>
          ? number
          : V extends RequiredBoolean<P>
          ? boolean
          : V extends RequiredEnum<P, infer Value>
          ? Value
          : V extends RequiredStringArray<P>
          ? readonly string[]
          : V extends RequiredNumberArray<P>
          ? readonly number[]
          : V extends RequiredBooleanArray<P>
          ? readonly boolean[]
          : // Another RequiredEnum?
            // : V extends RequiredEnum<P, infer Value>
            // ? InferEnumOrArrayValue<Value>[]
            never;
      } & {
        [P in V extends
          | OptionalString<infer Name>
          | OptionalNumber<infer Name>
          | OptionalBoolean<infer Name>
          // | OptionalEnum<infer Name, any>
          | OptionalStringArray<infer Name>
          | OptionalNumberArray<infer Name>
          | OptionalBooleanArray<infer Name>
          ? // | OptionalEnumArray<infer Name, any>
            Name
          : never]?: V extends OptionalString<P>
          ? string
          : V extends OptionalNumber<P>
          ? number
          : V extends OptionalBoolean<P>
          ? boolean
          : // : V extends OptionalEnum<P, infer Value>
          // ? InferEnumOrArrayValue<Value>
          V extends OptionalStringArray<P>
          ? readonly string[]
          : V extends OptionalNumberArray<P>
          ? readonly number[]
          : V extends OptionalBooleanArray<P>
          ? readonly boolean[]
          : // Another OptionalEnum?
            // : V extends OptionalEnum<P, infer Value>
            // ? InferEnumOrArrayValue<Value>[]
            never;
      }
    : never;
