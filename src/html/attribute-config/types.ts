import type {
  DSLInfer,
  DSLValidate,
  SupportedKeywordsConfig,
} from "@/dsl/index.ts";

export interface BaseHTMLAttributesConfig {
  [attribute: string]: string;
}

export type ValidateHTMLAttributesConfig<
  Keywords extends SupportedKeywordsConfig,
  A extends BaseHTMLAttributesConfig,
> = {
  [K in keyof A]: K extends string ? DSLValidate<Keywords, A[K]> : A[K];
};

export type InferHTMLAttributesConfig<
  Keywords extends SupportedKeywordsConfig,
  A extends BaseHTMLAttributesConfig,
> = {
  [K in keyof A]: K extends string ? DSLInfer<Keywords, A[K]> : A[K];
};
