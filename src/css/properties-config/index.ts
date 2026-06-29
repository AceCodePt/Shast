import { dslString } from "@/dsl/index.ts";
import type { BaseCSSSyntaxConfig } from "../syntax-config/types.ts";
import type {
  BaseCSSPropertiesConfig,
  ValidateCSSPropertiesConfig,
} from "./types.ts";

export const cssPropertiesConfig = <
  const K extends Record<string, any>,
  const S extends BaseCSSSyntaxConfig,
  const P extends BaseCSSPropertiesConfig,
>(
  keywords: K,
  syntaxConfig: S,
  config: ValidateCSSPropertiesConfig<K, S, P>,
) => {
  const entries = config;
  for (const key in entries) {
    const entry = entries[key];
    if (typeof entry === "object") {
      const syntax = entry.syntax;
      dslString(Object.assign({}, syntaxConfig, keywords), syntax);
    }
  }
  return config as P;
};
