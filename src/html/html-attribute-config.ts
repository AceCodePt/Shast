import type {
  EmptyParts,
  ErrorMessage,
  IllegalChar,
  SplitPipe,
  Trim,
} from "../types.ts";

export type BaseHTMLAttributeValue = string;
export type BaseHTMLAttributeConfig = Record<string, BaseHTMLAttributeValue>;

// ─────────────────────────────────────────────────────────────────────────────
// DSL validation + autocomplete (ArkType-style single-signature pattern).
//
// Valid atoms are reserved keywords (string, number, boolean, undefined, true,
// false) and quoted string literals ('foo' | "bar"). Atoms are separated by
// `|`. The DSL infers to the corresponding TS union via `InferHTMLValue`.
//
//   "string | undefined"       → string | undefined
//   "'foo' | 'bar' | 'baz'"    → "foo" | "bar" | "baz"
//   "number | false"           → number | false
//
// Completions are surfaced as siblings in the dropdown (no `| S` to mask
// them); a transient red squiggle appears mid-edit, same as the CSS module.
// ─────────────────────────────────────────────────────────────────────────────

// ── Reserved keywords (single source of truth) ──────────────────────────────

const RESERVED_KEYWORDS = ["string", "number", "boolean", "undefined"] as const;

type Reserved = (typeof RESERVED_KEYWORDS)[number];

const RESERVED_KEYWORD_SET: ReadonlySet<Reserved> = new Set(RESERVED_KEYWORDS);

/** Keyword → its inferred TS type. Exhaustive over `Reserved` by construction. */
type ReservedMap = {
  [K in Reserved]: K extends "string"
    ? string
    : K extends "number"
      ? number
      : K extends "boolean"
        ? boolean
        : K extends "undefined"
          ? undefined
          : never;
};

// ── Error messages (shared format between type-level and runtime) ───────────

type ErrIllegalChar<C extends string> =
  `🛑 Unexpected character '${C}' — only bare keywords and quoted strings allowed`;
type ErrEmptyAlt =
  `🛑 Empty alternative — every '|' must separate two non-empty values`;
type ErrBadQuote<P extends string> =
  `🛑 Invalid value '${P}' — unclosed or stray quote`;
type ErrUnknown<P extends string> =
  `🛑 Unknown keyword '${P}' — expected a reserved keyword or quoted string`;

const errIllegalChar = (key: string, c: string) =>
  `Attribute '${key}': 🛑 Unexpected character '${c}' — only bare keywords and quoted strings allowed`;
const errEmptyAlt = (key: string) =>
  `Attribute '${key}': 🛑 Empty alternative — every '|' must separate two non-empty values`;
const errBadQuote = (key: string, p: string) =>
  `Attribute '${key}': 🛑 Invalid value '${p}' — unclosed or stray quote`;
const errUnknown = (key: string, p: string) =>
  `Attribute '${key}': 🛑 Unknown keyword '${p}' — expected a reserved keyword or quoted string`;

// ── Segment helpers ─────────────────────────────────────────────────────────

/** Everything after the final `|`, or the whole string if there is no `|`. */
type LastSegment<S extends string> = S extends `${string}|${infer R}`
  ? LastSegment<R>
  : S;

/** Everything up to and including the final `|`, or `""` if there is no `|`. */
type PrefixBeforeLast<S extends string> = S extends `${infer A}|${infer R}`
  ? R extends `${string}|${string}`
    ? `${A}|${PrefixBeforeLast<R>}`
    : `${A}|`
  : "";

/** A single space iff the active segment starts with one (preserves "| foo"). */
type PrefixSpace<S extends string> =
  LastSegment<S> extends ` ${string}` ? " " : "";

/** Reserved keywords whose name begins with the partial fragment `P`. */
type ReservedMatching<P extends string> = {
  [K in Reserved]: K extends `${P}${string}` ? K : never;
}[Reserved];

/**
 * Build the completion union for the active segment.
 *
 * `Suggestions` is the set of reserved keywords to offer (filtered by partial
 * input, or all of `Reserved` when the segment is empty). `S` is NOT unioned
 * in — including it would mask sibling completions in the editor's dropdown.
 * The trade-off is a transient red squiggle until a completion is picked.
 */
type Completions<
  S extends string,
  Suggestions extends string,
> = `${PrefixBeforeLast<S>}${PrefixSpace<S>}${Suggestions}`;

// ── Atom shape predicates ───────────────────────────────────────────────────

/** A properly quoted literal: 'x' or "x". */
type IsQuoted<P extends string> = P extends `'${string}'`
  ? true
  : P extends `"${string}"`
    ? true
    : false;

/** Contains a quote character anywhere. */
type HasQuote<P extends string> = P extends `${string}'${string}`
  ? true
  : P extends `${string}"${string}`
    ? true
    : false;

/** Returns the atom if it has an unclosed/stray quote; `never` if clean. */
type BadPart<P extends string> =
  IsQuoted<P> extends true ? never : HasQuote<P> extends true ? P : never;

type BadParts<S extends string> =
  SplitPipe<S> extends infer P extends string ? BadPart<P> : never;

/** Returns the atom if it's neither reserved, quoted, nor empty; `never` otherwise. */
type CheckAtom<P extends string> = P extends Reserved | ""
  ? never
  : IsQuoted<P> extends true
    ? never
    : P;

type UnknownAtoms<S extends string> =
  SplitPipe<S> extends infer P extends string ? CheckAtom<Trim<P>> : never;

// ── Core validator ──────────────────────────────────────────────────────────

export type HTMLValidate<S extends string> = [IllegalChar<S>] extends [never]
  ? Trim<LastSegment<S>> extends ""
    ? // Active segment empty → suggest all keywords.
      // Fires for the initial "" and trailing "… | " inputs.
      Completions<S, Reserved>
    : Trim<LastSegment<S>> extends infer Last extends string
      ? ReservedMatching<Last> extends infer M extends string
        ? [M] extends [never]
          ? // No keyword starts with `Last` → full validation.
            FinishedCheck<S>
          : [Last] extends [M]
            ? // Exact match: keyword fully typed → validate.
              FinishedCheck<S>
            : // Genuine partial prefix → matching completions only.
              Completions<S, M>
        : never
      : never
  : ErrorMessage<ErrIllegalChar<IllegalChar<S>>>;

type FinishedCheck<S extends string> = [EmptyParts<S>] extends [never]
  ? [BadParts<S>] extends [never]
    ? [UnknownAtoms<S>] extends [never]
      ? S // ✅ valid
      : ErrorMessage<ErrUnknown<UnknownAtoms<S> & string>>
    : ErrorMessage<ErrBadQuote<BadParts<S> & string>>
  : ErrorMessage<ErrEmptyAlt>;

type MapAtom<S extends string> = S extends Reserved
  ? ReservedMap[S]
  : S extends `"${infer L}"`
    ? L
    : S extends `'${infer L}'`
      ? L
      : S;

export type InferHTMLValue<S extends string> = S extends `${infer A}|${infer B}`
  ? MapAtom<Trim<A>> | InferHTMLValue<Trim<B>>
  : MapAtom<Trim<S>>;

export type InferHTMLAttributes<A extends Record<string, string>> = {
  [K in keyof A]: InferHTMLValue<A[K]>;
};

const ILLEGAL_CHAR_RE = /[()\[\]{}]/;

function validatePart(part: string, key: string): void {
  if (part === "") throw new Error(errEmptyAlt(key));

  const first = part[0];
  if (first === "'" || first === '"') {
    // Must be closed by the same quote and have at least 2 chars.
    if (part.length < 2 || part[part.length - 1] !== first) {
      throw new Error(errBadQuote(key, part));
    }
    return;
  }

  if (part.includes("'") || part.includes('"')) {
    throw new Error(errBadQuote(key, part));
  }

  if (!RESERVED_KEYWORD_SET.has(part as Reserved)) {
    throw new Error(errUnknown(key, part));
  }
}

function validateDSL(input: string, key: string): void {
  const illegal = ILLEGAL_CHAR_RE.exec(input);
  if (illegal) throw new Error(errIllegalChar(key, illegal[0]));

  for (const raw of input.split("|")) validatePart(raw.trim(), key);
}

export type ValidateHTMLAttributeConfig<A extends BaseHTMLAttributeConfig> = {
  [K in keyof A]: A[K] extends HTMLValidate<A[K]> ? A[K] : HTMLValidate<A[K]>;
};

export const htmlAttributeConfig = <const A extends BaseHTMLAttributeConfig>(
  config: ValidateHTMLAttributeConfig<A>,
) => {
  for (const [key, value] of Object.entries(config)) {
    validateDSL(value, key);
  }
  return config as A;
};
