import type {
  EmptyParts,
  ErrorMessage,
  IllegalChar,
  Simplify,
  SplitPipe,
  Trim,
} from "../types.ts";
import type { BaseCSSSyntaxConfig } from "./css-syntax-config.ts";

// ─────────────────────────────────────────────────────────────────────────────
// ArkType-style single-signature DSL validation + autocomplete.
//
// `Validate<value, keys>` returns ONE of:
//
//   • a union of valid completions — when the active segment is empty (after
//     a trailing `|`) or mid-typing a "<token>". The dropdown surfaces each
//     suggestion as a sibling of the current input:
//
//       ""                  → "<length>" | "<color>" | …            (all tokens)
//       "<length> | "       → "<length> | <length>" | "<length> | <color>" | …
//       "<length> | <pe"    → "<length> | <percentage>"             (filtered)
//
//     A transient red squiggle appears on the partial input until a completion
//     is picked or the value is finished — this is the same trade-off ArkType
//     accepts in exchange for visible dropdown completions.
//
//   • a plain-string error message — for terminal mistakes (illegal characters,
//     empty alternatives at commit time, malformed tokens, unknown tokens). The
//     message is a real string literal (with a trailing zero-width space, like
//     ArkType) rather than an `& ErrorTag<{...}>` object, so the diagnostic
//     reads as one line: `Type '"..."' is not assignable to type '"🛑 ..."'`.
//
// Because it's a SINGLE signature (no overloads) and the error is a plain
// string (no object brand), there is no "No overload matches this call"
// wrapper and no dump of the syntax-config type in the diagnostic.
// ─────────────────────────────────────────────────────────────────────────────

type SyntaxKeys<S extends BaseCSSSyntaxConfig> = keyof S & string;

type KeyBody<K extends string> = K extends `<${infer B}>` ? B : never;

/** All keys whose body begins with the partial fragment `P` (for completion). */
type KeysMatching<
  P extends string,
  Keys extends string,
> = Keys extends infer K extends string
  ? KeyBody<K> extends `${P}${string}`
    ? K
    : never
  : never;

type MalformedPart<P extends string> = P extends `<${string}>`
  ? never
  : P extends `<${string}`
    ? P
    : P extends `${string}>`
      ? P
      : never;

type MalformedParts<S extends string> =
  SplitPipe<S> extends infer P extends string ? MalformedPart<P> : never;

type TokenParts<S extends string> =
  SplitPipe<S> extends infer P extends string
    ? P extends `<${string}>`
      ? P
      : never
    : never;

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

/** A single space iff the active segment starts with one (preserves "| <…>"). */
type PrefixSpace<S extends string> =
  LastSegment<S> extends ` ${string}` ? " " : "";

/**
 * Build the completion union for the active segment.
 *
 * `Suggestions` is the set of token names to offer (filtered by partial input,
 * or all tokens when the segment is empty). The current string `S` is NOT
 * unioned in — including it tends to mask sibling completions in the editor's
 * dropdown. The trade-off is a transient red squiggle on the partial input
 * until a completion is picked or the value is finished. ArkType makes the
 * same trade-off.
 */
type Completions<
  S extends string,
  Suggestions extends string,
> = `${PrefixBeforeLast<S>}${PrefixSpace<S>}${Suggestions}`;

/**
 * Core: completion union when the active segment is empty or mid-typing a
 * "<token>", otherwise full validation via `FinishedCheck`.
 */
type Validate<S extends string, Keys extends string> = [
  IllegalChar<S>,
] extends [never]
  ? Trim<LastSegment<S>> extends ""
    ? // ── Active segment is empty → suggest all tokens ──
      // Fires for the initial "" and for trailing "… | " inputs. Including
      // `S` in the union keeps the in-progress value assignable while typing.
      Completions<S, Keys>
    : Trim<LastSegment<S>> extends `<${infer Body}`
      ? Body extends `${string}>${string}`
        ? FinishedCheck<S, Keys> // token already closed → validate as complete
        : KeysMatching<Body, Keys> extends infer M extends string
          ? [M] extends [never]
            ? ErrorMessage<`🛑 No known token starts with '<${Body}'`>
            : Completions<S, M> // partial-prefix completion union
          : ErrorMessage<`🛑 parse error`>
      : FinishedCheck<S, Keys>
  : ErrorMessage<`🛑 Unexpected character '${IllegalChar<S>}' — only <tokens> separated by '|' are allowed`>;

type FinishedCheck<S extends string, Keys extends string> = [
  EmptyParts<S>,
] extends [never]
  ? [MalformedParts<S>] extends [never]
    ? [Exclude<TokenParts<S>, Keys>] extends [never]
      ? S // ✅ valid
      : ErrorMessage<`🛑 Unknown token '${Exclude<TokenParts<S>, Keys> & string}' — not defined in your CSS_SYNTAX config`>
    : ErrorMessage<`🛑 Malformed token '${MalformedParts<S> & string}' — missing closing '>'`>
  : ErrorMessage<`🛑 Empty alternative — every '|' must separate two non-empty values`>;

/** Validated shape of an attribute config (useful as a derived type). */
export type CSSAttributeConfig<
  S extends BaseCSSSyntaxConfig,
  A extends Record<string, string>,
> = {
  [K in keyof A]: Validate<A[K], SyntaxKeys<S>>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Inference: turn a validated DSL string into its perceived value type.
// Each "|"-separated part maps to either the syntax config's value type (for
// a "<token>") or the literal keyword itself (for a bare word like "none").
// ─────────────────────────────────────────────────────────────────────────────

type InferPart<P extends string, S> = P extends keyof S ? S[P] : P;

type InferDSL<Def extends string, S> = Def extends `${infer A}|${infer B}`
  ? InferPart<Trim<A>, S> | InferDSL<Trim<B>, S>
  : InferPart<Trim<Def>, S>;

/** The inferred value type for each attribute in a config. */
export type InferredCSSAttributes<
  S extends BaseCSSSyntaxConfig,
  A extends Record<string, string>,
> = Simplify<{
  [K in keyof A]: InferDSL<A[K], S>;
}>;

export function cssAttributeConfig<
  const S extends BaseCSSSyntaxConfig,
  const A extends Record<string, string>,
>(
  _syntax: S,
  attrs: {
    [K in keyof A]: A[K] extends Validate<A[K], SyntaxKeys<S>>
      ? A[K]
      : Validate<A[K], SyntaxKeys<S>>;
  },
) {
  return attrs as InferredCSSAttributes<S, A>;
}
