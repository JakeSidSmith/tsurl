import { DEFAULT_OPTIONS } from './constants';
import { TSURL } from './tsurl';
import { QueryParamsSchema, TSURLOptions, URLParamsSchema } from './types';

export * from './params';
export * from './types';
export { TSURL };

const createTSURL = <
  S extends URLParamsSchema = readonly never[],
  Q extends QueryParamsSchema = readonly never[]
>(
  schema: S,
  options: TSURLOptions<Q> = DEFAULT_OPTIONS
) => {
  return new TSURL(schema, options);
};

const createTSURLGroup = (
  options: Omit<TSURLOptions<never>, 'queryParams'>
) => {
  const createTSURL = <
    S extends URLParamsSchema = readonly never[],
    Q extends QueryParamsSchema = readonly never[]
  >(
    schema: S,
    optionOverrides: TSURLOptions<Q> = DEFAULT_OPTIONS
  ) => {
    return new TSURL(schema, { ...options, ...optionOverrides });
  };

  return { createTSURL };
};

export { createTSURL, createTSURLGroup };

export default createTSURL;
