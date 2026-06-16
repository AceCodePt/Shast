import type { Trim } from "@/types.ts";

// [x] - Support placing the primitives in a type as a string
// [x] - Support placing union types of primitives: string | number | undefined
// [x] - Support placing union types of true, false
// [x] - Support placing union types of numbers 0 1
// [x] - Support placing union types of strings '' / ""
// [x] - Support template literals ``
// [x] - Support union in template literals of primitives
// [x] - Support union in template literals of literals
// [x] - Support placing pipe | inside of quotes '|' / "'"
// [ ] - Add a test: for `'"|"'` and `"'|'"`
// [ ] - Prevent meaningless end pipe "string |"
// [ ] - Prevent misuse of spaces "string|number" or "   string   "
// [ ] - TODO: the type infer should receive the supported keywords as a <SK ext...>
// [ ] - TODO: make parse

// type writeUnresolvableMessage<token extends string> =
//   `'${token}' is unresolvable`;

const SUPPORTED_PRIMITIVES = {
  string: "" as string,
  number: 0 as number,
  bigint: BigInt(0) as bigint,
  boolean: true as boolean,
  undefined: undefined as undefined,
} as const;

const SUPPORTED_LITERALS = {
  true: true,
  false: false,
} as const;

type SupportedKeyword = typeof SUPPORTED_PRIMITIVES & typeof SUPPORTED_LITERALS;

type SupportedKeywordUnion = keyof SupportedKeyword;

export type DSLString = string;

type DSLValidate<
  T extends string,
  S extends string = SupportedKeywordUnion,
> = T extends `${infer L extends string}|${infer R extends string}`
  ? Trim<L> extends `${infer N extends number}`
    ? `${N} | ${Trim<DSLValidate<R, S>>}`
    : Trim<L> extends `\`${infer Str extends string}\``
      ? Str extends `\$\{${infer innerDSL extends string}\}`
        ? `\`${Trim<DSLValidate<innerDSL, S>>}\``
        : Trim<L>
      : Trim<L> extends `'${string}'` | `"${string}"`
        ? `${Trim<L>} | ${Trim<DSLValidate<R, S>>}`
        : Trim<L> extends S
          ? `${Trim<L>} | ${Trim<DSLValidate<R, S>>}`
          : [Extract<S, `${Trim<L>}${string}`>] extends [never]
            ? `'${Trim<L>}' is not supported`
            : `${Trim<L>} | ${Trim<DSLValidate<R, S>>}`
  : Trim<T> extends `${infer N extends number}`
    ? `${N}`
    : Trim<T> extends `\`${infer Str extends string}\``
      ? Str extends `\$\{${infer innerDSL extends string}\}`
        ? `\`\$\{${Trim<DSLValidate<innerDSL, S>>}\}\``
        : Trim<T>
      : Trim<T> extends `'${string}'` | `"${string}"`
        ? Trim<T>
        : Trim<T> extends S
          ? T
          : [Extract<S, `${Trim<T>}${string}`>] extends [never]
            ? `'${Trim<T>}' is not supported`
            : Extract<S, `${Trim<T>}${string}`>;

type InferOne<T extends string> = T extends keyof SupportedKeyword
  ? SupportedKeyword[T]
  : T extends `${infer N extends number}` // check if N is a number
    ? N
    : T extends `\`${infer S extends string}\``
      ? S extends `\$\{${infer innerDSL extends string}\}`
        ? `${DSLInfer<innerDSL>}`
        : `${S}`
      : T extends `'${infer S extends string}'` | `"${infer S extends string}"`
        ? S
        : never;

export type DSLInfer<T extends DSLString> = T extends `${infer L}|${infer R}`
  ? T extends `\`${infer Piped extends `${string}|${string}`}\`${infer Maybe extends string}`
    ? Piped extends `\$\{${infer innerDSL extends string}\}`
      ? `${DSLInfer<Trim<innerDSL>>}` | DSLInfer<Trim<Maybe>>
      : `${Piped}`
    : T extends `"${infer Piped extends `${string}|${string}`}"${infer Maybe extends string}`
      ? `${Piped}` | DSLInfer<Maybe>
      : T extends `'${infer Piped extends `${string}|${string}`}'${infer Maybe extends string}`
        ? `${Piped}` | DSLInfer<Maybe>
        : InferOne<Trim<L>> | DSLInfer<Trim<R>>
  : InferOne<Trim<T>>;

// type X = DSLInfer<"'|' | \"|\" | `|` | `${'|'}`">;
// type X = DSLInfer<`'"|"' | 1`>;

// function isSupportedKeyword(s: string): s is SupportedKeywordUnion {
//   return (
//     Object.keys(SUPPORTED_PRIMITIVES).includes(s) ||
//     Object.keys(SUPPORTED_LITERALS).includes(s)
//   );
// }

export function dslString<const DSL extends DSLString>(
  dslString: DSLValidate<DSL>,
) {
  // const parts = dslString.split("|").map((p) => p.trim());

  // if (parts.length === 0) {
  //   throw new Error(`Invalid DSL string: "${dslString}"`);
  // }
  return dslString;
}

export function parseValueAgainstDSL<const DSL extends DSLString>(
  dslString: DSLValidate<DSL>,
  checkAgainst: DSLInfer<DSL>,
): DSLInfer<DSL> {
  const parts = dslString.split("|").map((p) => p.trim());

  const matches = parts.some(
    (part) =>
      // This is for general types like string, undefined
      typeof checkAgainst === part ||
      // This for literals like true, false
      (part in SUPPORTED_LITERALS &&
        SUPPORTED_LITERALS[part as keyof typeof SUPPORTED_LITERALS] ===
          checkAgainst) ||
      // This is for numbers
      (!Number.isNaN(+part) && +part === checkAgainst) ||
      /^(('[^']*'))$|^(("[^"]*"))$|^((`[^`]*`))$/.test(part),
  );

  if (!matches) {
    throw new Error(
      `Value of type "${typeof checkAgainst}" does not match DSL "${dslString}"`,
    );
  }

  return checkAgainst as DSLInfer<DSL>;
}
