// type String = string;
// type Number = number;
// type Bigint = bigint;
// type Boolean = boolean;
// type Undefined = undefined;

import type { Trim } from "@/types.ts";

// [x] - Support placing the primitives in a type as a string
// [x] - Support placing union types of primitives: string | number | undefined
// [ ] - Support placing union types of explicits like:
// [ ] -  '' (string), 0 (number), true, false
// [ ] - Support template literals ``
// [ ] - Support union in template literals of primitives
// [ ] - Support union in template literals of explicits
// [ ] - Support extending the primitives dynamically

// type writeUnresolvableMessage<token extends string> =
//   `'${token}' is unresolvable`;

const SUPPORTED_PRIMITIVES = [
  "string",
  "number",
  "bigint",
  "boolean",
  "undefined",
] as const;

type SupportedPrimitivesUnion = (typeof SUPPORTED_PRIMITIVES)[number];

export type DSLString = string;

type DSLValidate<
  T extends string,
  S extends string = SupportedPrimitivesUnion,
> = T extends `${infer L extends string}|${infer R extends string}`
  ? Trim<L> extends S
    ? `${Trim<L>} | ${Trim<DSLValidate<R, Exclude<S, Extract<SupportedPrimitivesUnion, Trim<L>>>>>}`
    : [Extract<S, `${Trim<L>}${string}`>] extends [never]
      ? `'${Trim<L>}' is not supported`
      : `${Trim<L>} | ${Trim<DSLValidate<R>>}`
  : Trim<T> extends S
    ? T
    : [Extract<S, `${Trim<T>}${string}`>] extends [never]
      ? `'${Trim<T>}' is not supported`
      : Extract<S, `${Trim<T>}${string}`>;

type InferOne<T extends string> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : T extends "bigint"
      ? bigint
      : T extends "boolean"
        ? boolean
        : T extends "undefined"
          ? undefined
          : never;

export type DSLInfer<T extends DSLString> = T extends `${infer L}|${infer R}`
  ? InferOne<Trim<L>> | DSLInfer<Trim<R>>
  : InferOne<Trim<T>>;

export function dslString<const DSL extends DSLString>(
  dslString: DSLValidate<DSL>,
) {
  return dslString;
}

function isSupportedPrimitive(s: string): s is SupportedPrimitivesUnion {
  return SUPPORTED_PRIMITIVES.includes(s);
}

export function parseValueAgainstDSL<const DSL extends DSLString>(
  dslString: DSLValidate<DSL>,
  checkAgainst: DSLInfer<DSL>,
): DSLInfer<DSL> {
  const parts = dslString.split("|").map((p) => p.trim());

  if (parts.length === 0 || !parts.every(isSupportedPrimitive)) {
    throw new Error(`Invalid DSL string: "${dslString}"`);
  }

  const matches = parts.some((type) =>
    type === "undefined"
      ? checkAgainst === undefined
      : typeof checkAgainst === type,
  );

  if (!matches) {
    const actual =
      checkAgainst === undefined ? "undefined" : typeof checkAgainst;
    throw new Error(
      `Value of type "${actual}" does not match DSL "${dslString}"`,
    );
  }

  return checkAgainst as DSLInfer<DSL>;
}
