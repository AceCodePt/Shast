import type { Keyof } from "@/types.ts";
import type {
  BaseHTMLAttributesConfig,
  ValidateHTMLAttributesConfig,
} from "../attribute-config/types.ts";

type BaseInnerHTMLTagConfig<PossibleTags extends string> =
  | "*"
  | (PossibleTags | "#text")[];

export type BaseHTMLTagConfig = {
  [tag: string]: {
    attributes?: BaseHTMLAttributesConfig | undefined;
    innerHTML?: BaseInnerHTMLTagConfig<string> | undefined;
    cssPseudoClass?: string[] | undefined;
    cssPseudoElement?: string[] | undefined;
    [rest: string]: unknown;
  };
};

export type ValidateHTMLTagConfig<
  Keywords extends Record<string, any>,
  TagDefinition extends BaseHTMLTagConfig,
> = {
  [Tag in keyof TagDefinition]: Tag extends string
    ? {
        attributes: TagDefinition[Tag]["attributes"] extends ValidateHTMLAttributesConfig<
          Keywords,
          Exclude<TagDefinition[Tag]["attributes"], undefined>
        >
          ? TagDefinition[Tag]["attributes"]
          : ValidateHTMLAttributesConfig<
              Keywords,
              Exclude<TagDefinition[Tag]["attributes"], undefined>
            >;
        innerHTML: TagDefinition[Tag]["innerHTML"] extends BaseInnerHTMLTagConfig<
          Keyof<TagDefinition>
        >
          ? TagDefinition[Tag]["innerHTML"]
          : BaseInnerHTMLTagConfig<Keyof<TagDefinition>>;
        cssPseudoClass: TagDefinition[Tag]["cssPseudoClass"] extends `:${string}${string}`[]
          ? TagDefinition[Tag]["cssPseudoClass"]
          : `:${string}${string}`[];
        cssPseudoElement: TagDefinition[Tag]["cssPseudoElement"] extends `::${string}${string}`[]
          ? TagDefinition[Tag]["cssPseudoElement"]
          : `::${string}${string}`[];
      }
    : TagDefinition[Tag];
};
