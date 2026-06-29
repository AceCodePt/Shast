import type {
  BaseHTMLAttributesConfig,
  ValidateHTMLAttributesConfig,
} from "../attribute-config/types.ts";

export type BaseHTMLTag = string;
export type BaseInnerHTMLTagConfig<PossibleTags extends string = string> =
  | "*"
  | PossibleTags[];

export type BaseHTMLTagConfig<Tags extends string = string> = Record<
  Tags,
  {
    attributes?: BaseHTMLAttributesConfig;
    innerHTML: "*" | (Tags | "#text")[];
    cssPseudoClass?: `:${string}`[];
  }
>;

export type ValidateHTMLTagConfig<
  Keywords extends Record<string, any>,
  TagDefinition extends BaseHTMLTagConfig = BaseHTMLTagConfig,
> = {
  [Tag in keyof TagDefinition]: Tag extends string
    ? {
        // The keyof[keyof] is so the type exact i.e. no more new properties
        [K in keyof TagDefinition[Tag]]: K extends keyof BaseHTMLTagConfig[keyof BaseHTMLTagConfig]
          ? K extends "attributes"
            ? ValidateHTMLAttributesConfig<
                Keywords,
                Exclude<TagDefinition[Tag]["attributes"], undefined>
              >
            : TagDefinition[Tag][K]
          : never;
      }
    : TagDefinition[Tag];
};
