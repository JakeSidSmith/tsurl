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
  constructURLAndMaybeEncode,
  constructQuery,
  serializeQueryParams,
  serializeURLParams,
  constructPathAndMaybeEncode,
} from './utils';

export class TSURL<
  S extends URLParamsSchema = readonly never[],
  Q extends QueryParamsSchema = readonly never[]
> {
  private options: TSURLOptions<Q> &
    Required<Pick<TSURLOptions<Q>, 'queryParams'>>;
  private schema: S;

  public constructor(schema: S, options?: TSURLOptions<Q>) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      // We cast a default queryParams so that the output type of deconstruct doesn't have to handle it potentially being undefined
      queryParams: options?.queryParams ?? ([] as unknown as Q),
    };
    this.schema = schema;
  }

  public constructQuery = (queryParams: InferQueryParams<Q>) => {
    const query = constructQuery(
      queryParams,
      this.options.queryParams,
      this.options
    );

    if (query) {
      return `?${query}`;
    }

    return '';
  };

  public constructPath = (
    urlParams: InferURLParams<S>,
    queryParams: InferQueryParams<Q>
  ) => {
    const path = constructPathAndMaybeEncode(
      urlParams,
      this.schema,
      this.options
    );

    if (!this.options.queryParams.length) {
      return path;
    }

    return `${path}${this.constructQuery(queryParams)}`;
  };

  public constructURL = (
    urlParams: InferURLParams<S>,
    queryParams: InferQueryParams<Q>,
    optionOverrides?: Partial<Pick<TSURLOptions<Q>, 'baseURL'>>
  ) => {
    const options = {
      ...this.options,
      ...optionOverrides,
    };

    const url = constructURLAndMaybeEncode(urlParams, this.schema, options);

    if (!options.queryParams.length) {
      return url;
    }

    return `${url}${this.constructQuery(queryParams)}`;
  };

  public deconstruct = (url: string) => {
    const pathTemplate = this.getPathTemplate();
    const parsed = urlParse(this.options.decode ? decodeUrl(url) : url, false);

    const urlMatch = match<
      Record<string, string | undefined | null | ReadonlyArray<string>>
    >(pathTemplate)(parsed.pathname);

    if (!urlMatch) {
      throw new Error(
        `Provided url "${url}" was invalid for template "${pathTemplate}"`
      );
    }

    const queryParams = queryString.parseUrl(url, {
      decode: this.options.decode,
      arrayFormat: this.options.queryArrayFormat,
      arrayFormatSeparator: this.options.queryArrayFormatSeparator,
    }).query;

    return {
      urlParams: serializeURLParams(urlMatch.params, this.schema),
      queryParams: serializeQueryParams(queryParams, this.options.queryParams),
    };
  };

  public getPathTemplate = () => {
    const urlParams: Record<string, string> = {};

    this.schema.forEach((part) => {
      if (typeof part === 'object') {
        const optional = part.required ? '' : '?';
        urlParams[part.name] = `:${part.name}${optional}`;
      }
    });

    return constructPathAndMaybeEncode(urlParams, this.schema, this.options);
  };

  public getURLTemplate = () => {
    const urlParams: Record<string, string> = {};

    this.schema.forEach((part) => {
      if (typeof part === 'object') {
        const optional = part.required ? '' : '?';
        urlParams[part.name] = `:${part.name}${optional}`;
      }
    });

    return constructURLAndMaybeEncode(urlParams, this.schema, this.options);
  };
}
