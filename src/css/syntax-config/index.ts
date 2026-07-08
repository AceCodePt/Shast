import { dslString, detectCircularReferences } from "@/dsl/index.ts";
import type { BaseCSSSyntaxConfig, ValidatedCSSSyntaxConfig } from "./types.ts";

export function cssSyntaxConfig<
  const Keywords extends Record<string, any>,
  const T extends BaseCSSSyntaxConfig,
>(supportedKeywords: Keywords, config: ValidatedCSSSyntaxConfig<Keywords, T>) {
  for (const key in config) {
    if (!/^<.+>$/.test(key)) {
      throw new Error(`The key ${key} should start and end with <>`);
    }
    const item = config[key];
    dslString(Object.assign({}, supportedKeywords, config), item);
  }

  detectCircularReferences(config as Record<string, string>);

  return config as T;
}
