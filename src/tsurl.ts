import decodeUrl from 'decode-uri-component';
import { match } from 'path-to-regexp';
import queryString from 'query-string';
import urlParse from 'url-parse';

import { DEFAULT_OPTIONS } from './constants';
import { PartType } from './params';
import {
  DeconstructOptions,
  InferQueryParams,
  InferURLParams,
  QueryParamsSchema,
  SerializeValueOptions,
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
    const schemaPrefix =
      typeof options?.basePath !== 'undefined'
        ? ([] as readonly string[]).concat(options.basePath)
        : [];
    this.schema = [...schemaPrefix, ...schema] as unknown as S;
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
    queryParams: InferQueryParams<Q>
  ) => {
    const url = constructURLAndMaybeEncode(
      urlParams,
      this.schema,
      this.options
    );

    if (!this.options.queryParams.length) {
      return url;
    }

    return `${url}${this.constructQuery(queryParams)}`;
  };

  public deconstruct = (
    url: string,
    deconstructOptions?: DeconstructOptions
  ) => {
    const pathTemplate = constructPathAndMaybeEncode(
      this.getURLParams(),
      this.schema,
      this.options
    );
    const parsed = urlParse(this.options.decode ? decodeUrl(url) : url, false);

    const urlMatch = match<
      Record<string, string | undefined | null | readonly string[]>
    >(pathTemplate, {
      end: !deconstructOptions?.ignoreSubPaths,
    })(parsed.pathname);

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

    const serializeValueOptions: SerializeValueOptions = {
      ignoreInvalidEnums: deconstructOptions?.ignoreInvalidEnums,
    };

    return {
      urlParams: serializeURLParams(
        urlMatch.params,
        this.schema,
        serializeValueOptions
      ),
      queryParams: serializeQueryParams(
        queryParams,
        this.options.queryParams,
        serializeValueOptions
      ),
    };
  };

  private getURLParams = () => {
    const urlParams: Record<string, string> = {};

    this.schema.forEach((part) => {
      if (typeof part === 'object') {
        if (part.type === PartType.SPLAT) {
          urlParams[part.name] = `:${part.name}*`;
        } else {
          const optional = part.required ? '' : '?';
          urlParams[part.name] = `:${part.name}${optional}`;
        }
      }
    });

    return urlParams;
  };

  public getPathTemplate = () =>
    constructPathAndMaybeEncode(this.getURLParams(), this.schema, this.options);

  public getURLTemplate = () =>
    constructURLAndMaybeEncode(this.getURLParams(), this.schema, this.options);
}
