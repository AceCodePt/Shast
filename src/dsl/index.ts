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

export type SupportedKeywordsConfig = Record<string, any>;

export type DSLString = string;

// Small note: the never for R is critical
// See example: dslString("string |") and auto complete after the pipe
type PipeWhenExists<
  S extends SupportedKeywordsConfig,
  L extends string | number,
  R extends string | never = never,
> = [R] extends [never]
  ? Trim<`${L}`>
  : `${Trim<`${L}`>} | ${DSLValidate<S, R>}`;

type ValidateRestOfBackTick<
  S extends SupportedKeywordsConfig,
  Str extends string | never,
> = Str extends `\$\{${infer innerDSL extends string}\}${infer Maybe extends string}`
  ? `\${${Trim<DSLValidate<S, innerDSL>>}}${ValidateRestOfBackTick<S, Maybe>}`
  : `${Str}`;

type SingleDSLValidate<
  Keywords extends SupportedKeywordsConfig,
  L extends string,
  R extends string | never,
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
  S extends SupportedKeywordsConfig,
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
  Keywords extends SupportedKeywordsConfig,
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
  Keywords extends SupportedKeywordsConfig,
  Str extends string,
> = Str extends `${infer Before extends string}\$\{${infer innerDSL extends string}\}${infer Rest extends string}`
  ? `${Before}${DSLInfer<Keywords, innerDSL>}${InferRestOfBackTick<Keywords, Rest>}`
  : `${Str}`;

type SingleDSLInfer<
  Keywords extends SupportedKeywordsConfig,
  Text extends string,
> = Text extends keyof Keywords
  ? Keywords[Text] extends string
    ? DSLInfer<Keywords, Keywords[Text]>
    : Keywords[Text]
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
  Keywords extends SupportedKeywordsConfig,
  Text extends DSLString,
> = [Text] extends [never]
  ? string
  : string extends Text
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

function validateDSLPart(
  part: string,
  supportedKeywords: SupportedKeywordsConfig,
  fullDSL: string,
): void {
  const isKeyword = part in supportedKeywords;
  const isNumericLiteral = part !== "" && !Number.isNaN(+part);
  const isQuotedString = /^'[^']*'$|^"[^"]*"$|^`[^`]*`$/.test(part);
  const isTemplateLiteral = /^`.*`$/.test(part);

  if (!isKeyword && !isNumericLiteral && !isQuotedString && !isTemplateLiteral) {
    throw new Error(`Invalid DSL string: "${fullDSL}"`);
  }

  if (isTemplateLiteral && /\$\{/.test(part)) {
    const content = part.slice(1, -1);
    const interpolationRegex = /\$\{(.+?)\}/g;
    for (let match = interpolationRegex.exec(content); match; match = interpolationRegex.exec(content)) {
      const innerDSL = match[1]!;
      const innerParts = splitOutsideQuotes(innerDSL).map((p) => p.trim());
      for (const innerPart of innerParts) {
        validateDSLPart(innerPart, supportedKeywords, fullDSL);
      }
    }
  }
}

export function dslString<
  const Keywords extends SupportedKeywordsConfig,
  const DSL extends DSLString,
>(supportedKeywords: Keywords, dslString: DSLValidate<Keywords, DSL>) {
  const parts = splitOutsideQuotes(dslString).map((p) => p.trim());

  if (parts.length === 0 || (parts.length === 1 && parts[0] === "")) {
    throw new Error(`Invalid DSL string: "${dslString}"`);
  }

  for (const part of parts) {
    validateDSLPart(part, supportedKeywords, dslString);
  }

  return dslString;
}

export function extractTokenReferences(dsl: string): string[] {
  const tokens: string[] = [];
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;

  for (let i = 0; i < dsl.length; i++) {
    const ch = dsl[i];
    if (ch === "'" && !inDouble && !inBacktick) inSingle = !inSingle;
    else if (ch === '"' && !inSingle && !inBacktick) inDouble = !inDouble;
    else if (ch === "`" && !inSingle && !inDouble) inBacktick = !inBacktick;
    else if (ch === "<" && !inSingle && !inDouble) {
      const end = dsl.indexOf(">", i);
      if (end !== -1) {
        tokens.push(dsl.slice(i, end + 1));
        i = end;
      }
    }
  }

  return tokens;
}

export function detectCircularReferences(
  config: Record<string, string>,
): void {
  for (const key in config) {
    const refs = extractTokenReferences(config[key]!);
    if (refs.includes(key)) {
      throw new Error(
        `Circular reference detected: token "${key}" references itself`,
      );
    }
  }

  const graph = new Map<string, string[]>();
  for (const key in config) {
    const refs = extractTokenReferences(config[key]!).filter(
      (ref) => ref in config && ref !== key,
    );
    graph.set(key, refs);
  }

  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(node: string, path: string[]): void {
    visited.add(node);
    inStack.add(node);

    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, [...path, neighbor]);
      } else if (inStack.has(neighbor)) {
        throw new Error(
          `Circular reference detected: ${path.join(" -> ")} -> ${neighbor}`,
        );
      }
    }

    inStack.delete(node);
  }

  for (const key of graph.keys()) {
    if (!visited.has(key)) {
      dfs(key, [key]);
    }
  }
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
  const Keywords extends SupportedKeywordsConfig,
  const DSL extends DSLString,
>(
  supportedKeywords: Keywords, // { boolean: true, number: 0, true: true }
  dslString: DSLValidate<Keywords, DSL>, // 'true'
  checkAgainst: DSLInfer<Keywords, DSL>, // 'true'
): DSLInfer<Keywords, DSL> {
  // Validate the DSL string itself first (mirrors dslString() runtime check)
  const rawParts = splitOutsideQuotes(dslString).map((p) => p.trim());
  if (rawParts.length === 0 || (rawParts.length === 1 && rawParts[0] === "")) {
    throw new Error(`Invalid DSL string: "${dslString}"`);
  }
  for (const part of rawParts) {
    validateDSLPart(part, supportedKeywords, dslString);
  }

  const parts = rawParts;

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
