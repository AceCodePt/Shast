import type {
  BaseCSSAttributesConfig,
  InferCSSAttributesConfig,
} from "@/css/attribute-config/types.ts";
import type { BaseCSSPropertiesConfig } from "@/css/properties-config/types.ts";
import type { BaseCSSPseudoClassConfig } from "@/css/pseudo-class-config/types.ts";
import type { BaseCSSSyntaxConfig } from "@/css/syntax-config/types.ts";
import type { DSLInfer, SupportedKeywordsConfig } from "@/dsl/index.ts";
import type {
  BaseHTMLAttributesConfig,
  InferHTMLAttributesConfig,
} from "@/html/attribute-config/types.ts";
import type { BaseHTMLTagConfig } from "@/html/tag-config/types.ts";
import type { MakeUndefinedOptional } from "@/types.ts";

export type BaseComponentInnerHTMLStructure =
  | string
  | Record<string, BaseComponentStructure | string>;

export type BaseComponentStructure = {
  tag?: string;
  attributes?: Record<string, any>;
  css?: Record<string, unknown>;
  // Partially declared -> *** innerHTML?: Record<string, any> ***///
  // This is to make the stuff extra premissible so types won't
  // get screwed over
  [att: string]: unknown;
};

type IsTagAllowText<
  HTMLTagConfig extends BaseHTMLTagConfig,
  Tag extends keyof HTMLTagConfig,
> = "*" extends HTMLTagConfig[Tag]["innerHTML"]
  ? true
  : HTMLTagConfig[Tag]["innerHTML"] extends any[]
    ? "#text" extends HTMLTagConfig[Tag]["innerHTML"][number]
      ? true
      : false
    : false;

type GetAllowedTags<
  HTMLTagConfig extends BaseHTMLTagConfig,
  AllowedTags extends keyof HTMLTagConfig | "#text",
  Tag extends keyof HTMLTagConfig,
> = "*" extends HTMLTagConfig[Tag]["innerHTML"]
  ? AllowedTags
  : HTMLTagConfig[Tag]["innerHTML"] extends any[]
    ? "#text" extends HTMLTagConfig[Tag]["innerHTML"][number]
      ? AllowedTags & HTMLTagConfig[Tag]["innerHTML"][number]
      : HTMLTagConfig[Tag]["innerHTML"][number]
    : never;

type MaybeAttributes<HTMLAttributesConfig extends Record<string, any>> = {
  [K in keyof HTMLAttributesConfig]: K extends string
    ? HTMLAttributesConfig[K] extends `${string}undefined${string}`
      ? never
      : "attributes"
    : never;
}[keyof HTMLAttributesConfig];

type ValidateComponentInnerHTMLStructure<
  Keywords extends SupportedKeywordsConfig,
  HTMLInferedAttributesConfig extends Record<string, any>,
  HTMLTagConfig extends BaseHTMLTagConfig,
  CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  CSSAttributesConfig extends BaseCSSAttributesConfig,
  CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  CSSPropertiesConfig extends BaseCSSPropertiesConfig,
  AllowedTags extends keyof HTMLTagConfig | "#text",
  T extends BaseComponentInnerHTMLStructure,
  CurrentTag extends keyof HTMLTagConfig,
> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends string
            ? true extends IsTagAllowText<HTMLTagConfig, CurrentTag>
              ? T[K]
              : `This element cannot contain a string`
            : ValidateComponentStructure<
                Keywords,
                HTMLInferedAttributesConfig,
                HTMLTagConfig,
                CSSSyntaxConfig,
                CSSAttributesConfig,
                CSSPseudoClassConfig,
                CSSPropertiesConfig,
                HTMLTagConfig[CurrentTag]["innerHTML"] extends any[]
                  ? // This is the check for when
                    "#text" extends HTMLTagConfig[CurrentTag]["innerHTML"][number]
                    ? AllowedTags &
                        HTMLTagConfig[CurrentTag]["innerHTML"][number]
                    : AllowedTags
                  : AllowedTags,
                T[K],
                GetAllowedTags<HTMLTagConfig, AllowedTags, CurrentTag>
              >
          : T[K];
      }
    : T extends string
      ? true extends IsTagAllowText<HTMLTagConfig, CurrentTag>
        ? T
        : `This element cannot contain a string`
      : never;

type ValidateComponentCSSStructure<
  Keywords extends SupportedKeywordsConfig,
  HTMLTagConfig extends BaseHTMLTagConfig,
  CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  CSSAttributesConfig extends BaseCSSAttributesConfig,
  CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  CSSPropertiesConfig extends BaseCSSPropertiesConfig,
  T extends BaseComponentStructure,
  IsInPseudoElement extends boolean,
> = {
  [K in keyof T["innerHTML"] as `> ${K & string}`]?: K extends string
    ? T["innerHTML"][K] extends Record<string, any>
      ? ValidateComponentCSSStructure<
          Keywords,
          HTMLTagConfig,
          CSSSyntaxConfig,
          CSSAttributesConfig,
          CSSPseudoClassConfig,
          CSSPropertiesConfig,
          T["innerHTML"][K],
          IsInPseudoElement
        >
      : never
    : T["innerHTML"][K];
} & Partial<
  InferCSSAttributesConfig<Keywords, CSSSyntaxConfig, CSSAttributesConfig>
> & {
    [K in keyof CSSPropertiesConfig]?: K extends `--${string}`
      ? CSSPropertiesConfig[K]["syntax"] extends string
        ? DSLInfer<Keywords & CSSSyntaxConfig, CSSPropertiesConfig[K]["syntax"]>
        : never
      : CSSPropertiesConfig[K];
  } & {
    [K in
      | CSSPseudoClassConfig[number]
      | (T["tag"] extends string
          ? HTMLTagConfig[T["tag"]]["cssPseudoClass"] extends any[]
            ? HTMLTagConfig[T["tag"]]["cssPseudoClass"][number]
            : never
          : never)]?: ValidateComponentCSSStructure<
      Keywords,
      HTMLTagConfig,
      CSSSyntaxConfig,
      CSSAttributesConfig,
      CSSPseudoClassConfig,
      CSSPropertiesConfig,
      T,
      IsInPseudoElement
    >;
  } & (false extends IsInPseudoElement
    ? {
        [K in T["tag"] extends string
          ? HTMLTagConfig[T["tag"]]["cssPseudoElement"] extends any[]
            ? HTMLTagConfig[T["tag"]]["cssPseudoElement"][number]
            : never
          : never]?: ValidateComponentCSSStructure<
          Keywords,
          HTMLTagConfig,
          CSSSyntaxConfig,
          CSSAttributesConfig,
          CSSPseudoClassConfig,
          CSSPropertiesConfig,
          T,
          true
        >;
      }
    : {});

export type ValidateComponentStructure<
  Keywords extends SupportedKeywordsConfig,
  HTMLInferedAttributesConfig extends Record<string, any>,
  HTMLTagConfig extends BaseHTMLTagConfig,
  CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  CSSAttributesConfig extends BaseCSSAttributesConfig,
  CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  CSSPropertiesConfig extends BaseCSSPropertiesConfig,
  AllowedTags extends keyof HTMLTagConfig,
  T extends BaseComponentStructure,
  CurrentAllowedTags extends keyof HTMLTagConfig,
> = T["tag"] extends CurrentAllowedTags
  ? {
      [K in keyof T]: K extends string
        ? K extends "tag"
          ? T[K]
          : K extends "css"
            ? ValidateComponentCSSStructure<
                Keywords,
                HTMLTagConfig,
                CSSSyntaxConfig,
                CSSAttributesConfig,
                CSSPseudoClassConfig,
                CSSPropertiesConfig,
                T,
                false
              >
            : K extends "attributes"
              ? HTMLInferedAttributesConfig &
                  (HTMLTagConfig[T["tag"]]["attributes"] extends BaseHTMLAttributesConfig
                    ? MakeUndefinedOptional<
                        InferHTMLAttributesConfig<
                          Keywords,
                          HTMLTagConfig[T["tag"]]["attributes"]
                        >
                      >
                    : {})
              : K extends "innerHTML"
                ? HTMLTagConfig[T["tag"]]["innerHTML"] extends []
                  ? `No innerHTML for void elements` & { _err: true }
                  : T[K] extends BaseComponentInnerHTMLStructure
                    ? ValidateComponentInnerHTMLStructure<
                        Keywords,
                        HTMLInferedAttributesConfig,
                        HTMLTagConfig,
                        CSSSyntaxConfig,
                        CSSAttributesConfig,
                        CSSPseudoClassConfig,
                        CSSPropertiesConfig,
                        AllowedTags,
                        T[K],
                        T["tag"]
                      >
                    : never
                : never
        : never;
    } & (HTMLTagConfig[T["tag"]]["innerHTML"] extends []
      ? {}
      : {
          innerHTML?: {};
        }) &
      ("attributes" extends MaybeAttributes<
        HTMLTagConfig[T["tag"]]["attributes"]
      >
        ? {
            attributes: {};
          }
        : {
            attributes?: {};
          })
  : {
      tag: Exclude<CurrentAllowedTags, "#text">;
    };
