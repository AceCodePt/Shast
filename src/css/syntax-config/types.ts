import type { DSLString, DSLValidate, SupportedKeywords } from "@/dsl/index.ts";

export type BaseCSSSyntaxConfig = Record<`<${string}>`, DSLString>;

export type ValidatedCSSSyntaxConfig<T extends BaseCSSSyntaxConfig> = {
  [K in keyof T]: K extends string
    ? K extends `<${string}>`
      ? DSLValidate<T[K], SupportedKeywords & T>
      : `Should be wrapped with <>`
    : T[K];
};
