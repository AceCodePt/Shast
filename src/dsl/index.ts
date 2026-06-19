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
// [x] - Add a test: for `'"|"'`, `"'|'"` and "`|`"
// [ ] - Add a test for multiple ${ } in string template
// [ ] - Discuss: When should the code throw on invalid DSLString
// [ ] - Prevent meaningless end pipe "string |"
// [ ] - Prevent misuse of spaces "string|number" or "   string   "
// [ ] - TODO: the type infer should receive the supported keywords as a <SK ext...>
// [ ] - TODO: some tests allow "'|\''" weird case to exists (LOW Priority)

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

export type SupportedKeywords = typeof SUPPORTED_PRIMITIVES &
  typeof SUPPORTED_LITERALS;

export type DSLString = string;

// Small note: the never for R is critical
// See example: dslString("string |") and auto complete after the pipe
type PipeWhenExists<
  L extends string | number,
  R extends string | never = never,
  S extends Record<string, any> = SupportedKeywords,
> = [R] extends [never]
  ? Trim<`${L}`>
  : `${Trim<`${L}`>} | ${DSLValidate<R, S>}`;

type ValidateRestOfBackTick<
  Str extends string | never,
  S extends Record<string, any> = SupportedKeywords,
> = Str extends `\$\{${infer innerDSL extends string}\}${infer Maybe extends string}`
  ? `\${${Trim<DSLValidate<innerDSL, S>>}}${ValidateRestOfBackTick<Maybe, S>}`
  : `${Str}`;

type SingleDSLValidate<
  L extends string,
  R extends string,
  S extends Record<string, any> = SupportedKeywords,
> =
  Trim<L> extends `${infer N extends number}`
    ? PipeWhenExists<N, R, S>
    : Trim<L> extends `\`${infer Str extends string}\``
      ? PipeWhenExists<`\`${ValidateRestOfBackTick<Str, S>}\``, R, S>
      : Trim<L> extends `'${string}'` | `"${string}"`
        ? PipeWhenExists<L, R, S>
        : [Extract<keyof S, `${Trim<L>}${string}`>] extends [string]
          ? PipeWhenExists<Extract<keyof S, `${Trim<L>}${string}`>, R, S>
          : `'${Trim<L>}' is not supported`;

type DSLStringDelimiter<
  T extends string,
  D extends string,
  S extends Record<string, any> = SupportedKeywords,
> =
  Trim<T> extends `${D}${infer Piped extends `${string}|${string}`}${D}${infer Maybe extends string}`
    ? SingleDSLValidate<
        `${D}${Piped}${D}`,
        // We only pass the right side of the pipe so we get autocomplete
        Maybe extends `${string}|${infer Other extends string}` ? Other : never,
        S
      >
    : T extends `${infer L extends string}|${infer R extends string}`
      ? SingleDSLValidate<L, R, S>
      : SingleDSLValidate<T, never, S>;

export type DSLValidate<
  T extends string,
  S extends Record<string, any> = SupportedKeywords,
> =
  Trim<T> extends `"${string}"${string}`
    ? DSLStringDelimiter<T, '"', S>
    : Trim<T> extends `'${string}'${string}`
      ? DSLStringDelimiter<T, "'", S>
      : Trim<T> extends `\`${string}\`${string}`
        ? DSLStringDelimiter<T, "`", S>
        : T extends `${infer L extends string}|${infer R extends string}`
          ? SingleDSLValidate<L, R, S>
          : SingleDSLValidate<T, never, S>;

// type Check = DSLValidate<"`${number}${'px' | 'h'}`">;

type InferRestOfBackTick<S extends string> =
  S extends `${infer Before extends string}\$\{${infer innerDSL extends string}\}${infer Rest extends string}`
    ? `${Before}${DSLInfer<innerDSL>}${InferRestOfBackTick<Rest>}`
    : `${S}`;

type SingleDSLInfer<T extends string> = T extends keyof SupportedKeywords
  ? SupportedKeywords[T]
  : T extends `${infer N extends number}`
    ? N
    : T extends `\`${infer S extends string}\``
      ? InferRestOfBackTick<S>
      : T extends `'${infer S extends string}'` | `"${infer S extends string}"`
        ? S
        : never;

export type DSLInfer<T extends DSLString> =
  Trim<T> extends `\`${infer Piped extends `${string}|${string}`}\`${infer Maybe extends string}`
    ? Piped extends `${infer Before extends string}\$\{${infer innerDSL extends string}\}${infer After extends string}`
      ?
          | `${Before}${DSLInfer<Trim<innerDSL>>}${InferRestOfBackTick<After>}`
          | DSLInfer<Trim<Maybe>>
      : `${Piped}`
    : T extends
          | `"${infer Piped extends `${string}|${string}`}"${infer Maybe extends string}`
          | `'${infer Piped extends `${string}|${string}`}'${infer Maybe extends string}`
      ? `${Piped}` | DSLInfer<Maybe>
      : T extends `${infer L}|${infer R}`
        ? SingleDSLInfer<Trim<L>> | DSLInfer<Trim<R>>
        : SingleDSLInfer<Trim<T>>;

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

function splitOutsideQuotes(dslString: string) {
  const parts = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;

  for (let i = 0; i < dslString.length; i++) {
    const ch = dslString[i];

    if (ch === "'" && !inDouble && !inBacktick) {
      inSingle = !inSingle;
      current += ch;
    } else if (ch === '"' && !inSingle && !inBacktick) {
      inDouble = !inDouble;
      current += ch;
    } else if (ch === "`" && !inSingle && !inDouble) {
      inBacktick = !inBacktick;
      current += ch;
    } else if (ch === "|" && !inSingle && !inDouble && !inBacktick) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  parts.push(current);

  return parts;
}

export function parseValueAgainstDSL<const DSL extends DSLString>(
  dslString: DSLValidate<DSL>,
  checkAgainst: DSLInfer<DSL>,
): DSLInfer<DSL> {
  const parts = splitOutsideQuotes(dslString).map((p) => p.trim());

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
      // This is for string / backticks / whatever
      /^(('[^']*'))$|^(("[^"]*"))$|^((`[^`]*`))$/.test(part),
  );

  if (!matches) {
    throw new Error(
      `Value of type "${typeof checkAgainst}" does not match DSL "${dslString}"`,
    );
  }

  return checkAgainst as DSLInfer<DSL>;
}
