import type {
  BaseHTMLAttributeConfig,
  ValidateHTMLAttributeConfig,
} from "../attribute-config/types.ts";

export type BaseHTMLTag = string;
export type BaseInnerHTMLTagConfig<PossibleTags extends string = string> =
  | "*"
  | PossibleTags[];

export type BaseHTMLTagConfig<Tags extends string = string> = Record<
  Tags,
  {
    attributes?: BaseHTMLAttributeConfig;
    innerHTML: "*" | (Tags | "#text")[];
  }
>;

export type ValidateHTMLTagConfig<
  TagDefinition extends BaseHTMLTagConfig = BaseHTMLTagConfig,
> = {
  [Tag in keyof TagDefinition]: Tag extends string
    ? {
        // The keyof[keyof] is so the type exact i.e. no more new properties
        [K in keyof TagDefinition[Tag]]: K extends keyof BaseHTMLTagConfig[keyof BaseHTMLTagConfig]
          ? K extends "attributes"
            ? ValidateHTMLAttributeConfig<
                Exclude<TagDefinition[Tag]["attributes"], undefined>
              >
            : TagDefinition[Tag][K]
          : never;
      }
    : TagDefinition[Tag];
};
