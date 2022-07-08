import decodeUrl from 'decode-uri-component';
import { match } from 'path-to-regexp';
import queryString from 'query-string';
import urlParse from 'url-parse';

import { DEFAULT_OPTIONS } from './constants';
import { TSURLOptions, URLParamsSchema } from './types';
import {
  constructPath,
  constructQuery,
  serializeQueryParams,
  serializeURLParams,
} from './utils';

export class TSURL<
  RequiredStringURLKeys extends string = never,
  RequiredNumberURLKeys extends string = never,
  RequiredBooleanURLKeys extends string = never,
  OptionalStringURLKeys extends string = never,
  OptionalNumberURLKeys extends string = never,
  OptionalBooleanURLKeys extends string = never,
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
  private options: TSURLOptions<
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
  private schema: URLParamsSchema<
    RequiredStringURLKeys,
    RequiredNumberURLKeys,
    RequiredBooleanURLKeys,
    OptionalStringURLKeys,
    OptionalNumberURLKeys,
    OptionalBooleanURLKeys
  >;

  public constructor(
    schema: URLParamsSchema<
      RequiredStringURLKeys,
      RequiredNumberURLKeys,
      RequiredBooleanURLKeys,
      OptionalStringURLKeys,
      OptionalNumberURLKeys,
      OptionalBooleanURLKeys
    >,
    options: TSURLOptions<
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
    > = DEFAULT_OPTIONS
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.schema = schema;
  }

  public construct(
    urlParams: Record<RequiredStringURLKeys, string> &
      Record<RequiredNumberURLKeys, number> &
      Record<RequiredBooleanURLKeys, boolean> &
      Partial<Record<OptionalStringURLKeys, string>> &
      Partial<Record<OptionalNumberURLKeys, number>> &
      Partial<Record<OptionalBooleanURLKeys, boolean>>,
    queryParams: Record<RequiredStringQueryKeys, string> &
      Record<RequiredNumberQueryKeys, number> &
      Record<RequiredBooleanQueryKeys, boolean> &
      Record<RequiredStringArrayQueryKeys, string> &
      Record<RequiredNumberArrayQueryKeys, number> &
      Record<RequiredBooleanArrayQueryKeys, boolean> &
      Partial<Record<OptionalStringQueryKeys, string>> &
      Partial<Record<OptionalNumberQueryKeys, number>> &
      Partial<Record<OptionalBooleanQueryKeys, boolean>> &
      Partial<Record<OptionalStringArrayQueryKeys, string>> &
      Partial<Record<OptionalNumberArrayQueryKeys, number>> &
      Partial<Record<OptionalBooleanArrayQueryKeys, boolean>>
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

    const urlMatch = match(template)(parsed.pathname);

    if (!urlMatch) {
      throw new Error(`Provided url "${url}" was invalid`);
    }

    const queryParams = queryString.parseUrl(url, {
      decode: this.options.decode,
      arrayFormat: this.options.queryArrayFormat,
      arrayFormatSeparator: this.options.queryArrayFormatSeparator,
    }).query;

    return {
      urlParams: serializeURLParams(
        urlMatch.params as Record<string, string | undefined>,
        this.schema
      ),
      queryParams: serializeQueryParams(
        queryParams,
        this.options.queryParams || []
      ),
    };
  }

  public getURLTemplate() {
    const urlParams: Record<string, string> = {};

    this.schema.forEach((part) => {
      if (typeof part === 'object') {
        if (part.required) {
          urlParams[part.name] = `:${part.name}`;
        } else {
          urlParams[part.name] = `:${part.name}?`;
        }
      }
    });

    return constructPath(urlParams, this.schema, this.options);
  }
}
