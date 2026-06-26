import type { Trim } from "@/types.ts";

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

export const SUPPORTED_KEYWORDS = Object.assign(
  {},
  SUPPORTED_PRIMITIVES,
  SUPPORTED_LITERALS,
);

export type SupportedKeywords = typeof SUPPORTED_KEYWORDS;

export type DSLString = string;

// Small note: the never for R is critical
// See example: dslString("string |") and auto complete after the pipe
type PipeWhenExists<
  S extends Record<string, any>,
  L extends string | number,
  R extends string | never = never,
> = [R] extends [never]
  ? Trim<`${L}`>
  : `${Trim<`${L}`>} | ${DSLValidate<S, R>}`;

type ValidateRestOfBackTick<
  S extends Record<string, any>,
  Str extends string | never,
> = Str extends `\$\{${infer innerDSL extends string}\}${infer Maybe extends string}`
  ? `\${${Trim<DSLValidate<S, innerDSL>>}}${ValidateRestOfBackTick<S, Maybe>}`
  : `${Str}`;

type SingleDSLValidate<
  Keywords extends Record<string, any>,
  L extends string,
  R extends string,
> =
  Trim<L> extends `${infer N extends number}`
    ? PipeWhenExists<Keywords, N, R>
    : Trim<L> extends `\`${infer Str extends string}\``
      ? PipeWhenExists<
          Keywords,
          `\`${ValidateRestOfBackTick<Keywords, Str>}\``,
          R
        >
      : Trim<L> extends `'${string}'` | `"${string}"`
        ? PipeWhenExists<Keywords, L, R>
        : [Extract<keyof Keywords, `${Trim<L>}${string}`>] extends [string]
          ? PipeWhenExists<
              Keywords,
              Extract<keyof Keywords, `${Trim<L>}${string}`>,
              R
            >
          : `'${Trim<L>}' is not supported`;

type DSLStringDelimiter<
  S extends Record<string, any>,
  T extends string,
  D extends string,
> =
  Trim<T> extends `${D}${infer Piped extends `${string}|${string}`}${D}${infer Maybe extends string}`
    ? SingleDSLValidate<
        S,
        `${D}${Piped}${D}`,
        // We only pass the right side of the pipe so we get autocomplete
        Maybe extends `${string}|${infer Other extends string}` ? Other : never
      >
    : T extends `${infer L extends string}|${infer R extends string}`
      ? SingleDSLValidate<S, L, R>
      : SingleDSLValidate<S, T, never>;

export type DSLValidate<
  Keywords extends Record<string, any>,
  T extends DSLString,
> = [T] extends [never]
  ? string
  : Trim<T> extends `"${string}"${string}`
    ? DSLStringDelimiter<Keywords, T, '"'>
    : Trim<T> extends `'${string}'${string}`
      ? DSLStringDelimiter<Keywords, T, "'">
      : Trim<T> extends `\`${string}\`${string}`
        ? DSLStringDelimiter<Keywords, T, "`">
        : T extends `${infer L extends string}|${infer R extends string}`
          ? SingleDSLValidate<Keywords, L, R>
          : SingleDSLValidate<Keywords, T, never>;

type InferRestOfBackTick<
  Keywords extends Record<string, any>,
  Str extends string,
> = Str extends `${infer Before extends string}\$\{${infer innerDSL extends string}\}${infer Rest extends string}`
  ? `${Before}${DSLInfer<Keywords, innerDSL>}${InferRestOfBackTick<Keywords, Rest>}`
  : `${Str}`;

type SingleDSLInfer<
  Keywords extends Record<string, any>,
  Text extends string,
> = Text extends keyof Keywords
  ? Keywords[Text]
  : Text extends `${infer N extends number}`
    ? N
    : Text extends `\`${infer Str extends string}\``
      ? InferRestOfBackTick<Keywords, Str>
      : Text extends
            | `'${infer Str extends string}'`
            | `"${infer Str extends string}"`
        ? Str
        : never;

export type DSLInfer<
  Keywords extends Record<string, any>,
  Text extends DSLString,
> = [Text] extends [never]
  ? string
  : Trim<Text> extends `\`${infer Piped extends `${string}|${string}`}\`${infer Maybe extends string}`
    ? Piped extends `${infer Before extends string}\$\{${infer innerDSL extends string}\}${infer After extends string}`
      ?
          | `${Before}${DSLInfer<Keywords, Trim<innerDSL>>}${InferRestOfBackTick<Keywords, After>}`
          | DSLInfer<Keywords, Trim<Maybe>>
      : `${Piped}`
    : Text extends
          | `"${infer Piped extends `${string}|${string}`}"${infer Maybe extends string}`
          | `'${infer Piped extends `${string}|${string}`}'${infer Maybe extends string}`
      ? `${Piped}` | DSLInfer<Keywords, Maybe>
      : Text extends `${infer L}|${infer R}`
        ? SingleDSLInfer<Keywords, Trim<L>> | DSLInfer<Keywords, Trim<R>>
        : SingleDSLInfer<Keywords, Trim<Text>>;

export function dslString<
  const Keywords extends Record<string, any>,
  const DSL extends DSLString,
>(_supportedKeywords: Keywords, dslString: DSLValidate<Keywords, DSL>) {
  const parts = dslString.split("|").map((p) => p.trim());

  if (parts.length === 0) {
    throw new Error(`Invalid DSL string: "${dslString}"`);
  }
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

export function parseValueAgainstDSL<
  const Keywords extends Record<string, any>,
  const DSL extends DSLString,
>(
  supportedKeywords: Keywords, // { boolean: true, number: 0, true: true }
  dslString: DSLValidate<Keywords, DSL>, // 'true'
  checkAgainst: DSLInfer<Keywords, DSL>, // 'true'
): DSLInfer<Keywords, DSL> {
  const parts = splitOutsideQuotes(dslString).map((p) => p.trim());

  const matches = parts.some(
    (part) =>
      // This checkes the actual typeof
      (part in supportedKeywords &&
        typeof checkAgainst === typeof supportedKeywords[part]) ||
      // This for literals like true, false
      (`${checkAgainst}` === part &&
        part in supportedKeywords &&
        checkAgainst === supportedKeywords[part]) ||
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

  return checkAgainst as DSLInfer<Keywords, DSL>;
}
