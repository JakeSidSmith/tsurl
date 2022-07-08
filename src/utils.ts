import encodeurl from 'encodeurl';
import queryString from 'query-string';

import {
  MATCHES_MAYBE_PROTOCOL,
  MATCHES_MAYBE_TRAILING_SLASH,
  MATCHES_MULTIPLE_SLASHES,
} from './constants';
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
import {
  AnyPart,
  QueryParamsSchema,
  TSURLOptions,
  URLParamsSchema,
} from './types';

export const serializeValue = <T extends string>(
  part: AnyPart<T>,
  value: string | undefined | ReadonlyArray<string>
) => {
  if (part instanceof RequiredString && typeof value === 'string') {
    return value;
  }

  if (
    part instanceof OptionalString &&
    (typeof value === 'string' || typeof value === 'undefined')
  ) {
    return value;
  }

  if (part instanceof RequiredNumber && typeof value === 'string') {
    return parseFloat(value);
  }

  if (part instanceof OptionalNumber) {
    if (typeof value === 'string') {
      return parseFloat(value);
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (part instanceof RequiredBoolean && typeof value === 'string') {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }
  }

  if (part instanceof OptionalBoolean) {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (
    part instanceof RequiredStringArray &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    return ([] as readonly string[]).concat(value);
  }

  if (part instanceof OptionalStringArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return ([] as readonly string[]).concat(value);
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (
    part instanceof RequiredNumberArray &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    return ([] as readonly string[])
      .concat(value)
      .map((sub) => parseFloat(sub));
  }

  if (part instanceof OptionalNumberArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return ([] as readonly string[])
        .concat(value)
        .map((sub) => parseFloat(sub));
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (
    part instanceof RequiredBooleanArray &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    return ([] as readonly string[]).concat(value).map((sub) => {
      if (sub === 'true') {
        return true;
      }

      if (sub === 'false') {
        return false;
      }

      throw new Error(`Invalid value for part "${part.name}" - ${value}`);
    });
  }

  if (part instanceof OptionalBooleanArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return ([] as readonly string[]).concat(value).map((sub) => {
        if (sub === 'true') {
          return true;
        }

        if (sub === 'false') {
          return false;
        }

        throw new Error(`Invalid value for part "${part.name}" - ${value}`);
      });
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  throw new Error(`Invalid value for part "${part.name}" - ${value}`);
};

export const serializeURLParams = <
  S extends URLParamsSchema = readonly never[]
>(
  params: Record<string, string | undefined | null | ReadonlyArray<string>>,
  schema: S
) => {
  const serializedParams: Record<
    string,
    | undefined
    | string
    | number
    | boolean
    | readonly string[]
    | readonly number[]
    | readonly boolean[]
  > = {};

  schema.forEach((part) => {
    if (typeof part !== 'string') {
      const value = params[part.name];

      if (part.required && typeof value === 'undefined') {
        throw new Error(`Required URL param "${part.name}" was undefined`);
      }

      if (value === null) {
        throw new Error(`Invalid null value for URL param "${part.name}"`);
      }

      serializedParams[part.name] = serializeValue(part, value);
    }
  });

  return serializedParams as S extends readonly (infer V)[]
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
};

export const serializeQueryParams = <
  Q extends QueryParamsSchema = readonly never[]
>(
  params: Record<string, string | undefined | null | ReadonlyArray<string>>,
  schema: Q
) => {
  const serializedParams: Record<
    string,
    | undefined
    | string
    | number
    | boolean
    | readonly string[]
    | readonly number[]
    | readonly boolean[]
  > = {};

  schema.forEach((part) => {
    const value = params[part.name];

    if (part.required && typeof value === 'undefined') {
      throw new Error(`Required query param "${part.name}" was undefined`);
    }

    if (value === null) {
      throw new Error(`Invalid null value for URL param "${part.name}"`);
    }

    serializedParams[part.name] = serializeValue(part, value);
  });

  return serializedParams as Q extends readonly (infer V)[]
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
};

export const constructPath = <S extends URLParamsSchema = readonly never[]>(
  urlParams: Record<string, string | boolean | number>,
  urlParamsSchema: S,
  options: Omit<TSURLOptions<readonly never[]>, 'queryParams'>
) => {
  const { trailingSlash, protocol, encode, normalize } = options;

  let url = urlParamsSchema
    .map<string>((part) => {
      if (typeof part === 'string') {
        return part;
      }

      const value = urlParams[part.name];

      if (typeof value === 'undefined') {
        if (part.required) {
          throw new Error(`Required URL param "${part.name}" was not provided`);
        }

        return '';
      }

      return value.toString();
    })
    .join('/');

  if (normalize === true) {
    url = url.replace(MATCHES_MULTIPLE_SLASHES, '/');
  }

  if (trailingSlash === true) {
    url = url.replace(MATCHES_MAYBE_TRAILING_SLASH, '/');
  }

  if (trailingSlash === false) {
    url = url.replace(MATCHES_MAYBE_TRAILING_SLASH, '');
  }

  if (typeof protocol === 'string') {
    url = url.replace(MATCHES_MAYBE_PROTOCOL, protocol);
  }

  if (protocol === false) {
    url = url.replace(MATCHES_MAYBE_PROTOCOL, '');
  }

  if (encode === true) {
    url = encodeurl(url);
  }

  return url;
};

export const constructQuery = <Q extends QueryParamsSchema = readonly never[]>(
  queryParams: Record<
    string,
    | string
    | boolean
    | number
    | readonly string[]
    | readonly boolean[]
    | readonly number[]
  >,
  queryParamsShema: Q,
  options: TSURLOptions<Q>
) => {
  const { encode, queryArrayFormat, queryArrayFormatSeparator } = options;

  const filteredQueryParams: Record<string, unknown> = {};

  queryParamsShema.forEach((part) => {
    const value = queryParams[part.name];

    if (typeof value !== 'undefined') {
      filteredQueryParams[part.name] = value;
    } else if (part.required) {
      throw new Error(`Required query param "${part.name}" was not provided`);
    }
  });

  return queryString.stringify(filteredQueryParams, {
    encode,
    arrayFormat: queryArrayFormat,
    arrayFormatSeparator: queryArrayFormatSeparator,
  });
};
