import { TSURLOptions } from './types';

export const MATCHES_MULTIPLE_SLASHES = /\/{2,}/g;
export const MATCHES_MAYBE_TRAILING_SLASH = /\/?$/;
export const MATCHES_MAYBE_PROTOCOL = /^(?:(?:[^\/]+?:)?\/{0,2})?/;

export const DEFAULT_OPTIONS: TSURLOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> = {
  encode: true,
  decode: true,
  normalize: true,
  queryArrayFormatSeparator: ',',
};
