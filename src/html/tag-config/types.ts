import type { Keyof } from "@/types.ts";
import type {
  BaseHTMLAttributesConfig,
  ValidateHTMLAttributesConfig,
} from "../attribute-config/types.ts";

export type BaseHTMLTag = string;
type BaseInnerHTMLTagConfig<PossibleTags extends string> =
  | "*"
  | (PossibleTags | "#text")[];

export type BaseHTMLTagConfig = Record<
  string,
  {
    attributes?: BaseHTMLAttributesConfig;
    innerHTML?: BaseInnerHTMLTagConfig<string>;
    cssPseudoClass?: string[];
    cssPseudoElement?: string[];
  }
>;

export type ValidateHTMLTagConfig<
  Keywords extends Record<string, any>,
  TagDefinition extends BaseHTMLTagConfig,
> = {
  [Tag in keyof TagDefinition]: Tag extends string
    ? {
        attributes: ValidateHTMLAttributesConfig<
          Keywords,
          Exclude<TagDefinition[Tag]["attributes"], undefined>
        >;
        innerHTML: BaseInnerHTMLTagConfig<Keyof<TagDefinition>>;
        cssPseudoClass: `:${string}`[];
        cssPseudoElement: `::${string}`[];
      }
    : TagDefinition[Tag];
};
