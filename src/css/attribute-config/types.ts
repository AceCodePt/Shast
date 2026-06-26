import type { DSLInfer, DSLValidate } from "@/dsl/index.ts";
import type { BaseCSSSyntaxConfig } from "../syntax-config/types.ts";

export type BaseCSSAttributeValue = string;
export type BaseCSSAttributeConfig = Record<string, BaseCSSAttributeValue>;

export type ValidateCSSAttributeConfig<
  S extends BaseCSSSyntaxConfig,
  A extends BaseCSSAttributeConfig,
> = {
  [K in keyof A]: K extends string ? DSLValidate<S, A[K]> : A[K];
};

export type InferCSSAttributeConfig<
  S extends BaseCSSSyntaxConfig,
  A extends BaseCSSAttributeConfig,
> = {
  readonly [K in keyof A]: K extends string ? DSLInfer<S, A[K]> : A[K];
};
