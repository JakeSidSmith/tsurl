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

export const serializeValue = (
  part: AnyPart<string>,
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
    return ([] as ReadonlyArray<string>).concat(value);
  }

  if (part instanceof OptionalStringArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return ([] as ReadonlyArray<string>).concat(value);
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (
    part instanceof RequiredNumberArray &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    return ([] as ReadonlyArray<string>)
      .concat(value)
      .map((sub) => parseFloat(sub));
  }

  if (part instanceof OptionalNumberArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return ([] as ReadonlyArray<string>)
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
    return ([] as ReadonlyArray<string>).concat(value).map((sub) => {
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
      return ([] as ReadonlyArray<string>).concat(value).map((sub) => {
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
  RequiredStringURLKeys extends string = never,
  RequiredNumberURLKeys extends string = never,
  RequiredBooleanURLKeys extends string = never,
  OptionalStringURLKeys extends string = never,
  OptionalNumberURLKeys extends string = never,
  OptionalBooleanURLKeys extends string = never
>(
  params: Record<string, string | undefined | null | ReadonlyArray<string>>,
  schema: URLParamsSchema<
    RequiredStringURLKeys,
    RequiredNumberURLKeys,
    RequiredBooleanURLKeys,
    OptionalStringURLKeys,
    OptionalNumberURLKeys,
    OptionalBooleanURLKeys
  >
) => {
  const serializedParams = {} as Record<RequiredStringURLKeys, string> &
    Record<RequiredNumberURLKeys, number> &
    Record<RequiredBooleanURLKeys, boolean> &
    Partial<Record<OptionalStringURLKeys, string>> &
    Partial<Record<OptionalNumberURLKeys, number>> &
    Partial<Record<OptionalBooleanURLKeys, boolean>>;

  schema.forEach((part) => {
    if (typeof part !== 'string') {
      const value = params[part.name];

      if (part.required && typeof value === 'undefined') {
        throw new Error(`Required URL param "${part.name}" was undefined`);
      }

      if (value === null) {
        throw new Error(`Invalid null value for URL param "${part.name}"`);
      }

      serializedParams[part.name] = serializeValue(part, value) as (Record<
        RequiredStringURLKeys,
        string
      > &
        Record<RequiredNumberURLKeys, number> &
        Record<RequiredBooleanURLKeys, boolean> &
        Partial<Record<OptionalStringURLKeys, string>> &
        Partial<Record<OptionalNumberURLKeys, number>> &
        Partial<Record<OptionalBooleanURLKeys, boolean>>)[
        | RequiredStringURLKeys
        | RequiredNumberURLKeys
        | RequiredBooleanURLKeys
        | OptionalStringURLKeys
        | OptionalNumberURLKeys
        | OptionalBooleanURLKeys];
    }
  });

  return serializedParams;
};

export const serializeQueryParams = <
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
>(
  params: Record<string, string | undefined | null | ReadonlyArray<string>>,
  schema: QueryParamsSchema<
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
  >
) => {
  const serializedParams = {} as Record<RequiredStringQueryKeys, string> &
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
    Partial<Record<OptionalBooleanArrayQueryKeys, boolean>>;

  schema.forEach((part) => {
    const value = params[part.name];

    if (part.required && typeof value === 'undefined') {
      throw new Error(`Required query param "${part.name}" was undefined`);
    }

    if (value === null) {
      throw new Error(`Invalid null value for URL param "${part.name}"`);
    }

    serializedParams[part.name] = serializeValue(part, value) as (Record<
      RequiredStringQueryKeys,
      string
    > &
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
      Partial<Record<OptionalBooleanArrayQueryKeys, boolean>>)[
      | RequiredStringQueryKeys
      | RequiredNumberQueryKeys
      | RequiredBooleanQueryKeys
      | RequiredStringArrayQueryKeys
      | RequiredNumberArrayQueryKeys
      | RequiredBooleanArrayQueryKeys
      | OptionalStringQueryKeys
      | OptionalNumberQueryKeys
      | OptionalBooleanQueryKeys
      | OptionalStringArrayQueryKeys
      | OptionalNumberArrayQueryKeys
      | OptionalBooleanArrayQueryKeys];
  });

  return serializedParams;
};

export const constructPath = (
  urlParams: Record<string, undefined | string | number | boolean>,
  urlParamsSchema: URLParamsSchema<
    string,
    string,
    string,
    string,
    string,
    string
  >,
  options: TSURLOptions<
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  >
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

      return `${value}`;
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

export const constructQuery = (
  queryParams: Record<
    string,
    | undefined
    | string
    | number
    | boolean
    | ReadonlyArray<string>
    | ReadonlyArray<number>
    | ReadonlyArray<boolean>
  >,
  queryParamsShema: QueryParamsSchema<
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  >,
  options: TSURLOptions<
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  >
) => {
  const { encode, queryArrayFormat, queryArrayFormatSeparator } = options;

  const filteredQueryParams: typeof queryParams = {};

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
