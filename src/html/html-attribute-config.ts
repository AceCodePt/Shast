import type {
  EmptyParts,
  ErrorMessage,
  IllegalChar,
  Simplify,
  SplitPipe,
  Trim,
} from "../types.ts";

export type BaseHTMLAttributeValue = string | number | boolean | undefined;

export type BaseHTMLAttributeConfig = {
  [attribute: string]: BaseHTMLAttributeValue;
};

// ── DSL validation + autocomplete ────────────────────────────────────────────

type Reserved =
  | "string"
  | "number"
  | "boolean"
  | "undefined"
  | "true"
  | "false";

type LastSegment<S extends string> = S extends `${string}|${infer R}`
  ? LastSegment<R>
  : S;

type PrefixBeforeLast<S extends string> = S extends `${infer A}|${infer R}`
  ? R extends `${string}|${string}`
    ? `${A}|${PrefixBeforeLast<R>}`
    : `${A}|`
  : "";

type PrefixSpace<S extends string> =
  LastSegment<S> extends ` ${string}` ? " " : "";

type ReservedMatching<P extends string> = Reserved extends infer R extends
  string
  ? R extends `${P}${string}`
    ? R
    : never
  : never;

type BadPart<P extends string> = P extends `'${string}`
  ? P extends `'${string}'`
    ? never
    : P
  : P extends `"${string}`
    ? P extends `"${string}"`
      ? never
      : P
    : P extends `${string}'${string}`
      ? P
      : P extends `${string}"${string}`
        ? P
        : never;

type BadParts<S extends string> =
  SplitPipe<S> extends infer P extends string ? BadPart<P> : never;

type HTMLValidate<S extends string> = [IllegalChar<S>] extends [never]
  ? Trim<LastSegment<S>> extends infer Last extends string
    ? ReservedMatching<Last> extends infer M extends string
      ? [M] extends [never]
        ? [EmptyParts<S>] extends [never]
          ? [BadParts<S>] extends [never]
            ? Last extends Reserved
              ? S
              : Last extends `'${string}'` | `"${string}"`
                ? S
                : Last extends `'${string}` | `"${string}`
                  ? S
                  : ErrorMessage<`🛑 Unknown keyword '${Last}' — expected a reserved keyword or quoted string`>
            : ErrorMessage<`🛑 Invalid value '${BadParts<S> & string}' — unclosed or stray quote`>
          : ErrorMessage<`🛑 Empty alternative — every '|' must separate two non-empty values`>
        : {
            [K in M]: `${PrefixBeforeLast<S>}${PrefixSpace<S>}${K}`
          }[M]
      : never
    : never
  : ErrorMessage<`🛑 Unexpected character '${IllegalChar<S>}' — only bare keywords and quoted strings allowed`>;

// ── Type inference from DSL string ──────────────────────────────────────────

type MapAtom<S extends string> = S extends "string"
  ? string
  : S extends "number"
    ? number
    : S extends "boolean"
      ? boolean
      : S extends "undefined"
        ? undefined
        : S extends "true"
          ? true
          : S extends "false"
            ? false
            : S extends `"${infer L}"`
              ? L
              : S extends `'${infer L}'`
                ? L
                : S;

type InferHTMLValue<S extends string> = S extends `${infer A}|${infer B}`
  ? MapAtom<Trim<A>> | InferHTMLValue<Trim<B>>
  : MapAtom<Trim<S>>;

// ── Function ────────────────────────────────────────────────────────────────

export const htmlAttributeConfig = <
  const A extends Record<string, string>,
>(config: {
  [K in keyof A]: A[K] extends HTMLValidate<A[K]> ? A[K] : HTMLValidate<A[K]>;
}): Simplify<{ [K in keyof A]: InferHTMLValue<A[K]> }> => {
  return config as any;
};
