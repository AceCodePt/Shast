import { dslString, type SupportedKeywordsConfig } from "@/dsl/index.ts";
import type {
  BaseCSSAttributesConfig,
  ValidateCSSAttributesConfig,
} from "./types.ts";
import type { BaseCSSSyntaxConfig } from "@/css/syntax-config/types.ts";

export const cssAttributeConfig = <
  const Keywords extends SupportedKeywordsConfig,
  const S extends BaseCSSSyntaxConfig,
  const A extends BaseCSSAttributesConfig,
>(
  keywords: Keywords,
  syntaxConfig: S,
  config: ValidateCSSAttributesConfig<Keywords, S, A>,
) => {
  for (const key in config) {
    dslString(Object.assign({}, syntaxConfig, keywords), config[key]);
  }
  return config as A;
};
