import type { Keyof } from "@/types.ts";
import type { BaseHTMLTagConfig, ValidateHTMLTagConfig } from "./types.ts";
import { dslString } from "@/dsl/index.ts";

export const htmlTagConfig = <
  const Keywords extends Record<string, any>,
  const T extends BaseHTMLTagConfig<Keyof<T>>,
>(
  supportedKeywords: Keywords,
  config: ValidateHTMLTagConfig<Keywords, T>,
) => {
  const keys = Object.keys(config);

  for (const tag in config) {
    const attributes = config[tag].attributes;
    for (const attributeKey in attributes) {
      const attribute = attributes[attributeKey];
      dslString(supportedKeywords, attribute);
    }

    const innerHTML = config[tag].innerHTML;
    if (typeof innerHTML === "string") {
      continue;
    }
    for (const innerTag of innerHTML) {
      if (innerTag === "#text") {
        continue;
      }
      if (!keys.includes(innerTag)) {
        throw new Error(`The tag isn't included`);
      }
    }
  }

  return config as T;
};
