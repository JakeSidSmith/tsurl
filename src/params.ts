import { EnumValue, EnumLike } from './types';

export enum PartType {
  REQUIRED_STRING = 'REQUIRED_STRING',
  REQUIRED_NUMBER = 'REQUIRED_NUMBER',
  REQUIRED_BOOLEAN = 'REQUIRED_BOOLEAN',
  REQUIRED_ENUM = 'REQUIRED_ENUM',
  OPTIONAL_STRING = 'OPTIONAL_STRING',
  OPTIONAL_NUMBER = 'OPTIONAL_NUMBER',
  OPTIONAL_BOOLEAN = 'OPTIONAL_BOOLEAN',
  OPTIONAL_ENUM = 'OPTIONAL_ENUM',
  REQUIRED_STRING_ARRAY = 'REQUIRED_STRING_ARRAY',
  REQUIRED_NUMBER_ARRAY = 'REQUIRED_NUMBER_ARRAY',
  REQUIRED_BOOLEAN_ARRAY = 'REQUIRED_BOOLEAN_ARRAY',
  REQUIRED_ENUM_ARRAY = 'REQUIRED_ENUM_ARRAY',
  OPTIONAL_STRING_ARRAY = 'OPTIONAL_STRING_ARRAY',
  OPTIONAL_NUMBER_ARRAY = 'OPTIONAL_NUMBER_ARRAY',
  OPTIONAL_BOOLEAN_ARRAY = 'OPTIONAL_BOOLEAN_ARRAY',
  OPTIONAL_ENUM_ARRAY = 'OPTIONAL_ENUM_ARRAY',
  SPLAT = 'SPLAT',
}

const extractValidEnumValues = <V extends EnumValue, K extends string>(
  valid: readonly V[] | EnumLike<V, K>
) => {
  if (Array.isArray(valid)) {
    return valid;
  }

  const values = Object.values(valid);

  return values.reduce<readonly V[]>((acc, value) => {
    // Numbers are always values
    if (typeof value === 'number') {
      return [...acc, value as V];
    }

    // String values are not stored as keys
    if (
      typeof value === 'string' &&
      typeof (valid as EnumLike<V, K>)[value as unknown as K] !== 'number'
    ) {
      return [...acc, value as V];
    }

    return acc;
  }, []);
};

export class RequiredString<T extends string> {
  public readonly type = PartType.REQUIRED_STRING as const;
  public readonly required = true as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class RequiredNumber<T extends string> {
  public readonly type = PartType.REQUIRED_NUMBER as const;
  public readonly required = true as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class RequiredBoolean<T extends string> {
  public readonly type = PartType.REQUIRED_BOOLEAN as const;
  public readonly required = true as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class RequiredEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
> {
  public readonly type = PartType.REQUIRED_ENUM as const;
  public readonly required = true as const;
  public name: T;
  public valid: readonly V[];

  public constructor(name: T, valid: readonly V[]);
  public constructor(name: T, valid: EnumLike<V, K>);
  public constructor(name: T, valid: readonly V[] | EnumLike<V, K>) {
    this.name = name;
    this.valid = extractValidEnumValues(valid);
  }
}

export class RequiredStringArray<T extends string> {
  public readonly type = PartType.REQUIRED_STRING_ARRAY as const;
  public readonly required = true as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class RequiredNumberArray<T extends string> {
  public readonly type = PartType.REQUIRED_NUMBER_ARRAY as const;
  public readonly required = true as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class RequiredBooleanArray<T extends string> {
  public readonly type = PartType.REQUIRED_BOOLEAN_ARRAY as const;
  public readonly required = true as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class RequiredEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
> {
  public readonly type = PartType.REQUIRED_ENUM_ARRAY as const;
  public readonly required = true as const;
  public name: T;
  public valid: readonly V[];

  public constructor(name: T, valid: readonly V[]);
  public constructor(name: T, valid: EnumLike<V, K>);
  public constructor(name: T, valid: readonly V[] | EnumLike<V, K>) {
    this.name = name;
    this.valid = extractValidEnumValues(valid);
  }
}

export class OptionalString<T extends string> {
  public readonly type = PartType.OPTIONAL_STRING as const;
  public readonly required = false as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class OptionalNumber<T extends string> {
  public readonly type = PartType.OPTIONAL_NUMBER as const;
  public readonly required = false as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class OptionalBoolean<T extends string> {
  public readonly type = PartType.OPTIONAL_BOOLEAN as const;
  public readonly required = false as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class OptionalEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
> {
  public readonly type = PartType.OPTIONAL_ENUM as const;
  public readonly required = false as const;
  public name: T;
  public valid: readonly V[];

  public constructor(name: T, valid: readonly V[]);
  public constructor(name: T, valid: EnumLike<V, K>);
  public constructor(name: T, valid: readonly V[] | EnumLike<V, K>) {
    this.name = name;
    this.valid = extractValidEnumValues(valid);
  }
}

export class OptionalStringArray<T extends string> {
  public readonly type = PartType.OPTIONAL_STRING_ARRAY as const;
  public readonly required = false as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class OptionalNumberArray<T extends string> {
  public readonly type = PartType.OPTIONAL_NUMBER_ARRAY as const;
  public readonly required = false as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class OptionalBooleanArray<T extends string> {
  public readonly type = PartType.OPTIONAL_BOOLEAN_ARRAY as const;
  public readonly required = false as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export class OptionalEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
> {
  public readonly type = PartType.OPTIONAL_ENUM_ARRAY as const;
  public readonly required = false as const;
  public name: T;
  public valid: readonly V[];

  public constructor(name: T, valid: readonly V[]);
  public constructor(name: T, valid: EnumLike<V, K>);
  public constructor(name: T, valid: readonly V[] | EnumLike<V, K>) {
    this.name = name;
    this.valid = extractValidEnumValues(valid);
  }
}

export class Splat<T extends string> {
  public readonly type = PartType.SPLAT as const;
  public readonly required = false as const;
  public name: T;

  public constructor(name: T) {
    this.name = name;
  }
}

export const requiredString = <T extends string>(name: T) =>
  new RequiredString(name);

export const requiredNumber = <T extends string>(name: T) =>
  new RequiredNumber(name);

export const requiredBoolean = <T extends string>(name: T) =>
  new RequiredBoolean(name);

export function requiredEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[]): RequiredEnum<T, V, K>;
export function requiredEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: EnumLike<V, K>): RequiredEnum<T, V, K>;
export function requiredEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[] | EnumLike<V, K>) {
  return new RequiredEnum(name, valid as EnumLike<V, K>);
}

export const requiredStringArray = <T extends string>(name: T) =>
  new RequiredStringArray(name);

export const requiredNumberArray = <T extends string>(name: T) =>
  new RequiredNumberArray(name);

export const requiredBooleanArray = <T extends string>(name: T) =>
  new RequiredBooleanArray(name);

export function requiredEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[]): RequiredEnumArray<T, V, K>;
export function requiredEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: EnumLike<V, K>): RequiredEnumArray<T, V, K>;
export function requiredEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[] | EnumLike<V, K>) {
  return new RequiredEnumArray(name, valid as EnumLike<V, K>);
}

export const optionalString = <T extends string>(name: T) =>
  new OptionalString(name);

export const optionalNumber = <T extends string>(name: T) =>
  new OptionalNumber(name);

export const optionalBoolean = <T extends string>(name: T) =>
  new OptionalBoolean(name);

export function optionalEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[]): OptionalEnum<T, V, K>;
export function optionalEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: EnumLike<V, K>): OptionalEnum<T, V, K>;
export function optionalEnum<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[] | EnumLike<V, K>) {
  return new OptionalEnum(name, valid as EnumLike<V, K>);
}

export const optionalStringArray = <T extends string>(name: T) =>
  new OptionalStringArray(name);

export const optionalNumberArray = <T extends string>(name: T) =>
  new OptionalNumberArray(name);

export const optionalBooleanArray = <T extends string>(name: T) =>
  new OptionalBooleanArray(name);

export function optionalEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[]): OptionalEnumArray<T, V, K>;
export function optionalEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: EnumLike<V, K>): OptionalEnumArray<T, V, K>;
export function optionalEnumArray<
  T extends string,
  V extends EnumValue,
  K extends string = never
>(name: T, valid: readonly V[] | EnumLike<V, K>) {
  return new OptionalEnumArray(name, valid as EnumLike<V, K>);
}

export const splat = <T extends string>(name: T) => new Splat(name);
