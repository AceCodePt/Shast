import type { DSLValidate, SupportedKeywordsConfig } from "@/dsl/index.ts";
import type {
  BaseCSSSyntaxConfig,
  InferCSSSyntax,
} from "@/css/syntax-config/types.ts";

export type BaseCSSPropertyValue = {
  syntax?: string | undefined;
  inherits?: boolean | undefined;
  "initial-value"?: string | undefined;
};
export type BaseCSSPropertiesConfig = Record<
  `--${string}`,
  BaseCSSPropertyValue
>;

export type ValidateCSSPropertiesConfig<
  Keywords extends SupportedKeywordsConfig,
  S extends BaseCSSSyntaxConfig,
  P extends BaseCSSPropertiesConfig,
> = {
  [K in keyof P]: K extends string
    ? K extends `--${string}`
      ? {
          syntax: P[K]["syntax"] extends string
            ? DSLValidate<S, P[K]["syntax"]>
            : string;
          inherits: P[K]["inherits"] extends boolean
            ? P[K]["inherits"]
            : boolean;
          "initial-value": P[K]["syntax"] extends string
            ? P[K]["initial-value"] extends InferCSSSyntax<
                Keywords,
                S,
                P[K]["syntax"]
              >
              ? P[K]["initial-value"]
              : InferCSSSyntax<Keywords, S, P[K]["syntax"]>
            : P[K]["initial-value"];
        }
      : `You must have the property start with -- instead like --${K}`
    : P[K];
};
