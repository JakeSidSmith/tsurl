import decodeUrl from 'decode-uri-component';
import { match } from 'path-to-regexp';
import queryString from 'query-string';
import urlParse from 'url-parse';

import { DEFAULT_OPTIONS } from './constants';
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
import { QueryParamsSchema, TSURLOptions, URLParamsSchema } from './types';
import {
  constructPath,
  constructQuery,
  serializeQueryParams,
  serializeURLParams,
} from './utils';

export class TSURL<
  S extends URLParamsSchema = readonly never[],
  Q extends QueryParamsSchema = readonly never[]
> {
  private options: TSURLOptions<Q>;
  private schema: S;

  public constructor(schema: S, options?: TSURLOptions<Q>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.schema = schema;
  }

  public construct(
    urlParams: S extends readonly (infer V)[]
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
      : never,
    queryParams: Q extends readonly (infer V)[]
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
      : never
  ) {
    const path = constructPath(urlParams, this.schema, this.options);

    if (!this.options.queryParams?.length) {
      return path;
    }

    const queryParamsString = constructQuery(
      queryParams,
      this.options.queryParams,
      this.options
    );

    if (!queryParamsString) {
      return path;
    }

    return `${path}?${queryParamsString}`;
  }

  public deconstruct(url: string) {
    const template = this.getURLTemplate();
    const parsed = urlParse(this.options.decode ? decodeUrl(url) : url, false);

    const urlMatch = match<
      Record<string, string | undefined | null | ReadonlyArray<string>>
    >(template)(parsed.pathname);

    if (!urlMatch) {
      throw new Error(`Provided url "${url}" was invalid`);
    }

    const queryParams = queryString.parseUrl(url, {
      decode: this.options.decode,
      arrayFormat: this.options.queryArrayFormat,
      arrayFormatSeparator: this.options.queryArrayFormatSeparator,
    }).query;

    return {
      urlParams: serializeURLParams(urlMatch.params, this.schema),
      queryParams: serializeQueryParams(
        queryParams,
        this.options.queryParams ?? []
      ),
    };
  }

  public getURLTemplate() {
    const urlParams: Record<string, string> = {};

    this.schema.forEach((part) => {
      if (typeof part === 'object') {
        const optional = part.required ? '?' : '';
        urlParams[part.name] = `:${part.name}${optional}`;
      }
    });

    return constructPath(urlParams, this.schema, this.options);
  }
}
