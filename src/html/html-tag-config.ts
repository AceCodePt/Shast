import type { Keyof } from "../types.ts";
import type {
  BaseHTMLAttributeConfig,
  ValidateHTMLAttributeConfig,
} from "./html-attribute-config.ts";

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

type ValidateHTMLTagConfig<
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

export const htmlTagConfig = <const T extends BaseHTMLTagConfig<Keyof<T>>>(
  config: ValidateHTMLTagConfig<T>,
) => {
  return config as T;
};
