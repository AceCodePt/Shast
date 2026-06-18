import type { DSLValidate } from "@/dsl/index.ts";

export type PrimitiveSyntaxValue = string;
export type BaseCSSSyntaxConfig = Record<`<${string}${string}>`, string>;

export type ValidatedCSSSyntaxConfig<
  T extends BaseCSSSyntaxConfig = BaseCSSSyntaxConfig,
> = {
  [K in keyof T]: K extends string
    ? K extends `<${string}${string}>`
      ? DSLValidate<T[K]>
      : `🛑 ERROR: The key '${K}' must be wrapped in angle brackets (e.g., '<${K}>')`
    : T[K];
};
