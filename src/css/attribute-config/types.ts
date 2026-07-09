import type {
  DSLInfer,
  DSLValidate,
  SupportedKeywordsConfig,
} from "@/dsl/index.ts";
import type { BaseCSSSyntaxConfig } from "@/css/syntax-config/types.ts";

export type BaseCSSAttributeValue = string;
export type BaseCSSAttributesConfig = Record<string, BaseCSSAttributeValue>;

export type ValidateCSSAttributesConfig<
  Keywords extends SupportedKeywordsConfig,
  S extends BaseCSSSyntaxConfig,
  A extends BaseCSSAttributesConfig,
> = {
  [K in keyof A]: K extends string ? DSLValidate<S & Keywords, A[K]> : A[K];
};

export type InferCSSAttributesConfig<
  Keywords extends SupportedKeywordsConfig,
  S extends BaseCSSSyntaxConfig,
  A extends BaseCSSAttributesConfig,
> = {
  readonly [K in keyof A]: K extends string
    ? DSLInfer<S & Keywords, A[K]>
    : A[K];
};
