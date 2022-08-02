import { TSURLOptions } from './types';

export const MATCHES_MULTIPLE_SLASHES = /\/{2,}/g;
export const MATCHES_MAYBE_TRAILING_SLASH = /\/?$/;
export const MATCHES_LEADING_SLASHES = /^\/*/;
export const MATCHES_TRAILING_SLASHES = /\/*$/;

export const DEFAULT_OPTIONS: Omit<
  TSURLOptions<readonly never[]>,
  'queryParams'
> = {
  encode: true,
  decode: true,
  normalize: true,
  queryArrayFormatSeparator: ',',
};
