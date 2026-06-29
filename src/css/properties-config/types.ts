import type { DSLValidate } from "@/dsl/index.ts";
import type {
  BaseCSSSyntaxConfig,
  InferCSSSyntax,
} from "../syntax-config/types.ts";

export type BaseCSSPropertyValue = {
  syntax: string;
  inherits?: boolean;
  "initial-value"?: string;
};
export type BaseCSSPropertiesConfig = Record<
  `--${string}`,
  BaseCSSPropertyValue
>;

export type ValidateCSSPropertiesConfig<
  Keywords extends Record<string, any>,
  S extends BaseCSSSyntaxConfig,
  P extends BaseCSSPropertiesConfig,
> = {
  [K in keyof P]: K extends string
    ? K extends `--${string}`
      ? {
          syntax: DSLValidate<S, P[K]["syntax"]>;
          inherits: boolean;
          "initial-value": InferCSSSyntax<Keywords, S, P[K]["syntax"]>;
        }
      : `You must have the property start with -- instead like --${K}`
    : P[K];
};
