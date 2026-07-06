import type {
  BaseCSSAttributesConfig,
  InferCSSAttributesConfig,
} from "./css/attribute-config/types.ts";
import type { BaseCSSPropertiesConfig } from "./css/properties-config/types.ts";
import type { BaseCSSPseudoClassConfig } from "./css/pseudo-class-config/types.ts";
import type { BaseCSSSyntaxConfig } from "./css/syntax-config/types.ts";
import type { DSLInfer } from "./dsl/index.ts";
import type {
  BaseHTMLAttributesConfig,
  InferHTMLAttributesConfig,
} from "./html/attribute-config/types.ts";
import type { BaseHTMLTagConfig } from "./html/tag-config/types.ts";
import type { MakeUndefinedOptional } from "./types.ts";

type BaseComponentInnerHTMLStructure =
  | string
  | Record<string, BaseComponentStructure | string>;

type BaseComponentStructure = {
  tag?: string;
  attributes?: Record<string, any>;
  innerHTML?: BaseComponentInnerHTMLStructure;
  css?: Record<string, unknown>;
  // This is to make the stuff extra premissible so types won't
  // get screwed over
  [att: string]: unknown;
};

type IsTagElementVoid<
  HTMLTagConfig extends BaseHTMLTagConfig,
  Tag extends keyof HTMLTagConfig,
> = HTMLTagConfig[Tag]["innerHTML"] extends [] ? true : false;

type MaybeAttributes<
  Keywords extends Record<string, any>,
  HTMLAttributesConfig extends BaseHTMLAttributesConfig | undefined,
> = HTMLAttributesConfig extends BaseComponentInnerHTMLStructure
  ? {
      [K in keyof HTMLAttributesConfig]: K extends string
        ? undefined extends DSLInfer<Keywords, HTMLAttributesConfig[K]>
          ? never
          : "attributes"
        : never;
    }[keyof HTMLAttributesConfig]
  : never;

type ValidateComponentInnerHTMLStructure<
  Keywords extends Record<string, any>,
  HTMLAttributesConfig extends BaseHTMLAttributesConfig,
  HTMLTagConfig extends BaseHTMLTagConfig,
  CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  CSSAttributesConfig extends BaseCSSAttributesConfig,
  CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  CSSPropertiesConfig extends BaseCSSPropertiesConfig,
  Tags extends keyof HTMLTagConfig,
  T extends BaseComponentInnerHTMLStructure,
> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends string
            ? "#text" extends Tags
              ? T[K]
              : `This element cannot contain strings`
            : ValidateComponentStructure<
                Keywords,
                HTMLAttributesConfig,
                HTMLTagConfig,
                CSSSyntaxConfig,
                CSSAttributesConfig,
                CSSPseudoClassConfig,
                CSSPropertiesConfig,
                Tags,
                T[K]
              >
          : T[K];
      }
    : T extends string
      ? "#text" extends Tags
        ? T
        : `This element cannot contain a string`
      : never;

type ValidateComponentCSSStructure<
  Keywords extends Record<string, any>,
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

type ValidateComponentStructure<
  Keywords extends Record<string, any>,
  HTMLAttributesConfig extends BaseHTMLAttributesConfig,
  HTMLTagConfig extends BaseHTMLTagConfig,
  CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  CSSAttributesConfig extends BaseCSSAttributesConfig,
  CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  CSSPropertiesConfig extends BaseCSSPropertiesConfig,
  Tags extends keyof HTMLTagConfig,
  T extends BaseComponentStructure,
> = T["tag"] extends Tags
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
              ? MakeUndefinedOptional<
                  InferHTMLAttributesConfig<
                    Keywords,
                    HTMLAttributesConfig &
                      (HTMLTagConfig[T["tag"]]["attributes"] extends BaseHTMLAttributesConfig
                        ? HTMLTagConfig[T["tag"]]["attributes"]
                        : {})
                  >
                >
              : K extends "innerHTML"
                ? HTMLTagConfig[T["tag"]]["innerHTML"] extends []
                  ? `No innerHTML for void elements` & { _err: true }
                  : T[K] extends BaseComponentInnerHTMLStructure
                    ? ValidateComponentInnerHTMLStructure<
                        Keywords,
                        HTMLAttributesConfig,
                        HTMLTagConfig,
                        CSSSyntaxConfig,
                        CSSAttributesConfig,
                        CSSPseudoClassConfig,
                        CSSPropertiesConfig,
                        "*" extends HTMLTagConfig[T["tag"]]["innerHTML"]
                          ? keyof HTMLTagConfig | "#text"
                          : HTMLTagConfig[T["tag"]]["innerHTML"] extends any[]
                            ? HTMLTagConfig[T["tag"]]["innerHTML"][number]
                            : never,
                        T[K]
                      >
                    : never
                : never
        : never;
    } & {} & (true extends IsTagElementVoid<HTMLTagConfig, T["tag"]>
        ? {}
        : {
            innerHTML?: {};
          }) &
      ("attributes" extends MaybeAttributes<
        Keywords,
        HTMLTagConfig[T["tag"]]["attributes"]
      >
        ? {
            attributes: {};
          }
        : {
            attributes?: {};
          })
  : {
      tag: Exclude<Tags, "#text">;
    };

export function createComponent<
  const Keywords extends Record<string, any>,
  const HTMLAttributesConfig extends BaseHTMLAttributesConfig,
  const HTMLTagConfig extends BaseHTMLTagConfig,
  const CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  const CSSAttributesConfig extends BaseCSSAttributesConfig,
  const CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  const CSSPropertiesConfig extends BaseCSSPropertiesConfig,
  const T extends BaseComponentStructure,
>(
  _supportedKeywords: Keywords,
  _HTMLAttributesConfig: HTMLAttributesConfig,
  _HTMLTagConfig: HTMLTagConfig,
  _CSSSyntaxConfig: CSSSyntaxConfig,
  _CSSAttributesConfig: CSSAttributesConfig,
  _CSSPseudoClassConfig: CSSPseudoClassConfig,
  _CSSPropertiesConfig: CSSPropertiesConfig,
  config: ValidateComponentStructure<
    Keywords,
    HTMLAttributesConfig,
    HTMLTagConfig,
    CSSSyntaxConfig,
    CSSAttributesConfig,
    CSSPseudoClassConfig,
    CSSPropertiesConfig,
    keyof HTMLTagConfig | "#text",
    T
  >,
) {
  return config as T;
}
