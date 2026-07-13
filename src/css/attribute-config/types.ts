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
> = keyof A extends string
  ? {
      [K in keyof A]: DSLValidate<S & Keywords, A[K]>;
    }
  : A;

export type InferCSSAttributesConfig<
  Keywords extends SupportedKeywordsConfig,
  S extends BaseCSSSyntaxConfig,
  A extends BaseCSSAttributesConfig,
> = {
  readonly [K in keyof A]: K extends string
    ? DSLInfer<S & Keywords, A[K]>
    : A[K];
};
