import type {
  DSLInfer,
  DSLString,
  DSLValidate,
  SupportedKeywords,
} from "@/dsl/index.ts";

export type BaseCSSSyntaxConfig = Record<`<${string}>`, DSLString>;

export type ValidatedCSSSyntaxConfig<
  Keywords extends Record<string, any>,
  T extends BaseCSSSyntaxConfig,
> = {
  [K in keyof T]: K extends string
    ? K extends `<${string}>`
      ? DSLValidate<Keywords & T, T[K]>
      : `Should be wrapped with <>`
    : T[K];
};

export type InferCSSSyntaxConfig<
  Keywords extends Record<string, any>,
  T extends BaseCSSSyntaxConfig,
> = {
  [K in keyof T]: DSLInfer<Keywords & T, T[K] & string>;
};

export type InferCSSSyntax<
  Keywords extends Record<string, any>,
  S extends BaseCSSSyntaxConfig,
  Syn extends string,
> = Syn extends keyof S
  ? DSLInfer<Keywords & S, S[Syn] & string>
  : never;
