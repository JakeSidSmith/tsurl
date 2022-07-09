import decodeUrl from 'decode-uri-component';
import { match } from 'path-to-regexp';
import queryString from 'query-string';
import urlParse from 'url-parse';

import { DEFAULT_OPTIONS } from './constants';
import {
  InferQueryParams,
  InferURLParams,
  QueryParamsSchema,
  TSURLOptions,
  URLParamsSchema,
} from './types';
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

  public construct = (
    urlParams: InferURLParams<S>,
    queryParams: InferQueryParams<Q>
  ) => {
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
  };

  public deconstruct = (url: string) => {
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
  };

  public getURLTemplate = () => {
    const urlParams: Record<string, string> = {};

    this.schema.forEach((part) => {
      if (typeof part === 'object') {
        const optional = part.required ? '' : '?';
        urlParams[part.name] = `:${part.name}${optional}`;
      }
    });

    return constructPath(urlParams, this.schema, this.options);
  };
}
