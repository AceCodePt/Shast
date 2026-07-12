import type { Trim } from "@/types.ts";

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

export interface SupportedKeywordsConfig {
  [attribute: string]: any;
}

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
  T extends string,
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
  Text extends string,
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

  if (
    !isKeyword &&
    !isNumericLiteral &&
    !isQuotedString &&
    !isTemplateLiteral
  ) {
    throw new Error(`Invalid DSL string: "${fullDSL}"`);
  }

  if (isTemplateLiteral && /\$\{/.test(part)) {
    const content = part.slice(1, -1);
    const interpolationRegex = /\$\{(.+?)\}/g;
    for (
      let match = interpolationRegex.exec(content);
      match;
      match = interpolationRegex.exec(content)
    ) {
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
  const DSL extends string,
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

export function detectCircularReferences(config: Record<string, string>): void {
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

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function dslTokenToRegExp(token: string): string | null {
  const trimmed = token.trim();
  if (trimmed === "string") return ".*";
  if (trimmed === "number") return "\\d+(?:\\.\\d+)?";
  if (trimmed === "bigint") return "\\d+";
  if (trimmed === "boolean") return "(?:true|false)";
  if (trimmed === "true") return "true";
  if (trimmed === "false") return "false";
  if (trimmed === "undefined") return "undefined";
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return escapeRegExp(trimmed.slice(1, -1));
  }
  if (trimmed !== "" && !Number.isNaN(+trimmed)) return escapeRegExp(trimmed);
  return null;
}

function interpolationToRegExp(content: string): string | null {
  const alternatives: string[] = [];
  for (const token of splitOutsideQuotes(content)) {
    const regExp = dslTokenToRegExp(token);
    if (regExp === null) return null;
    alternatives.push(regExp);
  }
  return alternatives.length > 0 ? `(?:${alternatives.join("|")})` : null;
}

function templateLiteralToRegExp(template: string): RegExp | null {
  let pattern = "^";
  let index = 0;

  while (index < template.length) {
    if (template.charAt(index) === "$" && template.charAt(index + 1) === "{") {
      const end = template.indexOf("}", index + 2);
      if (end === -1) return null;
      const replacement = interpolationToRegExp(template.slice(index + 2, end));
      if (replacement === null) return null;
      pattern += replacement;
      index = end + 1;
    } else {
      pattern += escapeRegExp(template.charAt(index));
      index += 1;
    }
  }

  return new RegExp(`${pattern}$`);
}

function matchValueAgainstPart(
  part: string,
  supportedKeywords: SupportedKeywordsConfig,
  checkAgainst: unknown,
): boolean {
  // Token reference / nested DSL: a keyword whose value is a non-empty DSL string
  if (
    part in supportedKeywords &&
    typeof supportedKeywords[part] === "string" &&
    supportedKeywords[part] !== ""
  ) {
    try {
      parseValueAgainstDSL(
        supportedKeywords,
        supportedKeywords[part],
        checkAgainst as never,
      );
      return true;
    } catch {
      return false;
    }
  }

  // Primitive keyword (string/number/bigint/boolean/undefined): match by typeof
  if (
    part in supportedKeywords &&
    typeof checkAgainst === typeof supportedKeywords[part]
  ) {
    return true;
  }

  // Literal keyword such as true/false
  if (
    part in supportedKeywords &&
    `${checkAgainst}` === part &&
    checkAgainst === supportedKeywords[part]
  ) {
    return true;
  }

  // Numeric literal
  if (part !== "" && !Number.isNaN(+part) && +part === checkAgainst) {
    return true;
  }

  // String literal: 'value' or "value"
  if (
    (part.startsWith("'") && part.endsWith("'")) ||
    (part.startsWith('"') && part.endsWith('"'))
  ) {
    return checkAgainst === part.slice(1, -1);
  }

  // Template literal: compile to a regex and match the stringified value
  if (part.startsWith("`") && part.endsWith("`")) {
    const regExp = templateLiteralToRegExp(part.slice(1, -1));
    return regExp !== null && regExp.test(String(checkAgainst));
  }

  return false;
}

export function parseValueAgainstDSL<
  const Keywords extends SupportedKeywordsConfig,
  const DSL extends string,
>(
  supportedKeywords: Keywords, // { boolean: true, number: 0, true: true }
  dslString: DSLValidate<Keywords, DSL>, // 'true'
  checkAgainst: DSLInfer<Keywords, DSL>, // 'true'
): DSLInfer<Keywords, DSL> {
  // Validate the DSL string itself first (mirrors dslString() runtime check)
  const parts = splitOutsideQuotes(dslString).map((p) => p.trim());
  if (parts.length === 0 || (parts.length === 1 && parts[0] === "")) {
    throw new Error(`Invalid DSL string: "${dslString}"`);
  }
  for (const part of parts) {
    validateDSLPart(part, supportedKeywords, dslString);
  }

  const matches = parts.some((part) =>
    matchValueAgainstPart(part, supportedKeywords, checkAgainst),
  );

  if (!matches) {
    throw new Error(
      `Value of type "${typeof checkAgainst}" does not match DSL "${dslString}"`,
    );
  }

  return checkAgainst as DSLInfer<Keywords, DSL>;
}
