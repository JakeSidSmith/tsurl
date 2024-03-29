import encodeurl from 'encodeurl';
import queryString from 'query-string';

import {
  MATCHES_LEADING_SLASHES,
  MATCHES_MAYBE_TRAILING_SLASH,
  MATCHES_MULTIPLE_SLASHES,
  MATCHES_TRAILING_SLASHES,
} from './constants';
import {
  OptionalBoolean,
  OptionalBooleanArray,
  OptionalEnum,
  OptionalEnumArray,
  OptionalNumber,
  OptionalNumberArray,
  OptionalString,
  OptionalStringArray,
  PartType,
  RequiredBoolean,
  RequiredBooleanArray,
  RequiredEnum,
  RequiredEnumArray,
  RequiredNumber,
  RequiredNumberArray,
  RequiredString,
  RequiredStringArray,
  Splat,
} from './params';
import {
  AnyPart,
  EnumValue,
  InferQueryParams,
  InferURLParams,
  QueryParamsSchema,
  SerializeValueOptions,
  TSURLOptions,
  URLParamsSchema,
} from './types';

export const serializeValue = <T extends string>(
  part: AnyPart<T>,
  value: string | undefined | readonly string[],
  options?: SerializeValueOptions
) => {
  const { ignoreInvalidEnums = false } = options || {};
  const valueErrorMessage = `Invalid value for part "${part.name}" - ${value}`;

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

  if (part instanceof RequiredEnum || part instanceof OptionalEnum) {
    const validValue = part.valid.find((v) => v.toString() === value);

    if (typeof validValue !== 'undefined') {
      return validValue;
    } else if (
      part instanceof OptionalEnum &&
      (typeof value === 'undefined' || ignoreInvalidEnums)
    ) {
      return undefined;
    }
  }

  if (
    part instanceof RequiredStringArray &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    const values = ([] as readonly string[]).concat(value);

    if (values.length) {
      return values;
    }
  }

  if (part instanceof OptionalStringArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      const values = ([] as readonly string[]).concat(value);

      if (values.length) {
        return values;
      }

      return undefined;
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (
    part instanceof RequiredNumberArray &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    const values = ([] as readonly string[])
      .concat(value)
      .map((sub) => parseFloat(sub));

    if (values.length) {
      return values;
    }
  }

  if (part instanceof OptionalNumberArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      const values = ([] as readonly string[])
        .concat(value)
        .map((sub) => parseFloat(sub));

      if (values.length) {
        return values;
      }

      return undefined;
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (
    part instanceof RequiredBooleanArray &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    const values = ([] as readonly string[]).concat(value).map((sub) => {
      if (sub === 'true') {
        return true;
      }

      if (sub === 'false') {
        return false;
      }

      throw new Error(valueErrorMessage);
    });

    if (values.length) {
      return values;
    }
  }

  if (part instanceof OptionalBooleanArray) {
    if (typeof value === 'string' || Array.isArray(value)) {
      const values = ([] as readonly string[]).concat(value).map((sub) => {
        if (sub === 'true') {
          return true;
        }

        if (sub === 'false') {
          return false;
        }

        throw new Error(valueErrorMessage);
      });

      if (values.length) {
        return values;
      }

      return undefined;
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  if (
    (part instanceof RequiredEnumArray || part instanceof OptionalEnumArray) &&
    (typeof value === 'string' || Array.isArray(value))
  ) {
    const values = ([] as readonly (string | number)[])
      .concat(value)
      .reduce<readonly EnumValue[]>((acc, sub) => {
        const validValue = part.valid.find((v) => v.toString() === sub);

        if (typeof validValue !== 'undefined') {
          return [...acc, validValue];
        } else if (ignoreInvalidEnums) {
          return acc;
        }

        throw new Error(valueErrorMessage);
      }, []);

    if (values.length) {
      return values;
    }

    if (part instanceof OptionalEnumArray) {
      return undefined;
    }
  }

  if (part instanceof OptionalEnumArray && typeof value === 'undefined') {
    return undefined;
  }

  if (part instanceof Splat) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return ([] as readonly string[]).concat(value);
    }

    if (typeof value === 'undefined') {
      return value;
    }
  }

  throw new Error(valueErrorMessage);
};

export const serializeURLParams = <
  S extends URLParamsSchema = readonly never[]
>(
  params: Record<string, string | undefined | null | readonly string[]>,
  schema: S,
  options?: SerializeValueOptions
) => {
  const serializedParams: Record<
    string,
    | undefined
    | string
    | number
    | boolean
    | readonly string[]
    | readonly number[]
    | readonly (string | number)[]
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

      serializedParams[part.name] = serializeValue(part, value, options);
    }
  });

  return serializedParams as InferURLParams<S>;
};

export const serializeQueryParams = <
  Q extends QueryParamsSchema = readonly never[]
>(
  params: Record<string, string | undefined | null | readonly string[]>,
  schema: Q,
  options?: SerializeValueOptions
) => {
  const serializedParams: Record<
    string,
    | undefined
    | string
    | number
    | boolean
    | readonly string[]
    | readonly (string | number)[]
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

    serializedParams[part.name] = serializeValue(part, value, options);
  });

  return serializedParams as InferQueryParams<Q>;
};

export const constructPath = <S extends URLParamsSchema = readonly never[]>(
  urlParams: Record<string, string | boolean | number | readonly string[]>,
  urlParamsSchema: S,
  options: Omit<TSURLOptions<readonly never[]>, 'queryParams'>
) => {
  const { trailingSlash, normalize } = options;

  let path = urlParamsSchema
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

      if (part.type === PartType.SPLAT && Array.isArray(value)) {
        return value.join('/');
      }

      return value.toString();
    })
    .join('/');

  if (normalize === true) {
    path = path.replace(MATCHES_MULTIPLE_SLASHES, '/');
  }

  if (trailingSlash === true) {
    path = path.replace(MATCHES_MAYBE_TRAILING_SLASH, '/');
  }

  if (trailingSlash === false) {
    path = path.replace(MATCHES_MAYBE_TRAILING_SLASH, '');
  }

  return path;
};

export const constructPathAndMaybeEncode = <
  S extends URLParamsSchema = readonly never[]
>(
  urlParams: Record<string, string | boolean | number>,
  urlParamsSchema: S,
  options: Omit<TSURLOptions<readonly never[]>, 'queryParams'>
) => {
  const { encode } = options;

  let path = constructPath(urlParams, urlParamsSchema, options);

  if (encode === true) {
    path = encodeurl(path);
  }

  return path;
};

export const constructURLAndMaybeEncode = <
  S extends URLParamsSchema = readonly never[]
>(
  urlParams: Record<string, string | boolean | number>,
  urlParamsSchema: S,
  options: Omit<TSURLOptions<readonly never[]>, 'queryParams'>
) => {
  const { baseURL, encode, normalize } = options;

  let url = constructPath(urlParams, urlParamsSchema, options);

  if (baseURL) {
    if (normalize) {
      url = `${baseURL.replace(MATCHES_TRAILING_SLASHES, '')}/${url.replace(
        MATCHES_LEADING_SLASHES,
        ''
      )}`;
    } else {
      url = `${baseURL}${url}`;
    }
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
  queryParamsSchema: Q,
  options: TSURLOptions<Q>
) => {
  const { encode, queryArrayFormat, queryArrayFormatSeparator } = options;

  const filteredQueryParams: Record<string, unknown> = {};

  queryParamsSchema.forEach((part) => {
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
