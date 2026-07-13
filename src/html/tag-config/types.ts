import type { SupportedKeywordsConfig } from "@/dsl/index.ts";
import type {
  BaseHTMLAttributesConfig,
  ValidateHTMLAttributesConfig,
} from "@/html/attribute-config/types.ts";

export interface BaseHTMLTagConfig {
  [tag: string]: {
    attributes: BaseHTMLAttributesConfig;
    innerHTML: "*" | string[];
    cssPseudoClass: `:${string}${string}`[];
    cssPseudoElement: `::${string}${string}`[];
  };
}

export type ValidateHTMLTagConfig<
  Keywords extends SupportedKeywordsConfig,
  TagDefinition extends BaseHTMLTagConfig,
> = keyof TagDefinition extends string
  ? {
      [Tag in keyof TagDefinition]: {
        attributes: ValidateHTMLAttributesConfig<
          Keywords,
          TagDefinition[Tag]["attributes"]
        >;
        innerHTML: "*" | (keyof TagDefinition | "#text")[];
        cssPseudoClass: `:${string}${string}`[];
        cssPseudoElement: `::${string}${string}`[];
      };
    }
  : TagDefinition;
