import type {
  DSLInfer,
  DSLString,
  DSLValidate,
  SupportedKeywordsConfig,
} from "@/dsl/index.ts";

export type BaseCSSSyntaxConfig = Record<`<${string}>`, DSLString>;

export type ValidateCSSSyntaxConfig<
  Keywords extends SupportedKeywordsConfig,
  T extends BaseCSSSyntaxConfig,
> = {
  [K in keyof T]: K extends string
    ? K extends `<${string}>`
      ? DSLValidate<Keywords & T, T[K]>
      : `Should be wrapped with <>`
    : T[K];
};

export type InferCSSSyntaxConfig<
  Keywords extends SupportedKeywordsConfig,
  T extends BaseCSSSyntaxConfig,
> = {
  [K in keyof T]: DSLInfer<Keywords & T, T[K] & string>;
};

export type InferCSSSyntax<
  Keywords extends SupportedKeywordsConfig,
  S extends BaseCSSSyntaxConfig,
  Syn extends string,
> = Syn extends keyof S ? DSLInfer<Keywords & S, S[Syn] & string> : never;
