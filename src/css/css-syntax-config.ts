import type { Simplify } from "../types.ts";

declare const _error: unique symbol;
type ErrorTag<Msg extends string> = { [_error]: Msg };

export type PrimitiveSyntaxValue = string;

export type BaseCSSSyntaxConfig = Record<`<${string}${string}>`, string>;

export type ValidatedCSSSyntaxConfig<
  T extends BaseCSSSyntaxConfig = BaseCSSSyntaxConfig,
> = {
  [K in keyof T]: K extends string
    ? K extends `<${string}${string}>`
      ? T[K] extends string
        ? T[K] extends keyof T
          ? T[T[K] & keyof T]
          : T[K]
        : T[K] &
            ErrorTag<`🛑 ERROR: The value of '${K}' must be any type of string`>
      : T[K] &
          ErrorTag<`🛑 ERROR: The key '${K}' must be wrapped in angle brackets (e.g., '<${K}>')`>
    : T[K];
};

export function cssSyntaxConfig<const T extends BaseCSSSyntaxConfig>(
  config: T,
) {
  return config as Simplify<ValidatedCSSSyntaxConfig<T>>;
}
