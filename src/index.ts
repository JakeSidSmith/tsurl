import { DEFAULT_OPTIONS } from './constants';
import { TSURL } from './tsurl';
import * as TYPES from './types';

export * from './params';
export * from './types';
export { TSURL };

const createTSURL = <
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
>(
  schema: TYPES.URLParamsSchema<
    RequiredStringURLKeys,
    RequiredNumberURLKeys,
    RequiredBooleanURLKeys,
    OptionalStringURLKeys,
    OptionalNumberURLKeys,
    OptionalBooleanURLKeys
  >,
  options: TYPES.TSURLOptions<
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
) => {
  return new TSURL(schema, options);
};

export default createTSURL;
