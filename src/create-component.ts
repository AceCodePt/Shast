import type {
  BaseCSSAttributesConfig,
  InferCSSAttributesConfig,
} from "./css/attribute-config/types.ts";
import type { BaseCSSPropertiesConfig } from "./css/properties-config/types.ts";
import type { BaseCSSPseudoClassConfig } from "./css/pseudo-class-config/types.ts";
import type { BaseCSSSyntaxConfig } from "./css/syntax-config/types.ts";
import {
  parseValueAgainstDSL,
  type DSLInfer,
  type SupportedKeywordsConfig,
} from "./dsl/index.ts";
import type {
  BaseHTMLAttributesConfig,
  InferHTMLAttributesConfig,
} from "./html/attribute-config/types.ts";
import type { BaseHTMLTagConfig } from "./html/tag-config/types.ts";
import type { MakeUndefinedOptional } from "./types.ts";

type BaseComponentInnerHTMLStructure =
  | string
  | Record<string, BaseComponentStructure | string>;

export type BaseComponentStructure = {
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

type MaybeAttributes<
  Keywords extends SupportedKeywordsConfig,
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
  Keywords extends SupportedKeywordsConfig,
  HTMLAttributesConfig extends BaseHTMLAttributesConfig,
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
                HTMLAttributesConfig,
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
  HTMLAttributesConfig extends BaseHTMLAttributesConfig,
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
                        AllowedTags,
                        T[K],
                        T["tag"]
                      >
                    : never
                : never
        : never;
    } & { css?: {} } & (true extends IsTagElementVoid<HTMLTagConfig, T["tag"]>
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
      tag: Exclude<CurrentAllowedTags, "#text">;
    };

type AllowedTagSet = Set<string> | null;

function intersectAllowed(
  inheritedAllowed: AllowedTagSet,
  list: readonly string[],
): Set<string> {
  if (inheritedAllowed === null) {
    return new Set(list);
  }
  return new Set(list.filter((entry) => inheritedAllowed.has(entry)));
}

export function validateComponentNode(
  node: unknown,
  keywords: SupportedKeywordsConfig,
  globalAttributes: BaseHTMLAttributesConfig,
  tagConfig: BaseHTMLTagConfig,
  inheritedAllowed: AllowedTagSet,
): void {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    throw new Error(
      "Validation Error: Provided node is not a valid component object",
    );
  }

  const record = node as BaseComponentStructure;

  const tag = record.tag;
  if (typeof tag !== "string") {
    throw new Error(
      "Validation Error: Component node is missing a valid string 'tag' property",
    );
  }

  const tagDefinition = tagConfig[tag];
  if (tagDefinition === undefined) {
    throw new Error(
      `Structural Error: '<${tag}>' is not a recognized configuration tag in your registry`,
    );
  }

  const attributes = record.attributes;
  if (attributes !== undefined && attributes !== null) {
    const tagAttributes = tagDefinition.attributes ?? {};
    for (const [attributeKey, value] of Object.entries(attributes)) {
      const dsl = tagAttributes[attributeKey] ?? globalAttributes[attributeKey];
      if (dsl === undefined) {
        throw new Error(
          `Attribute Error: Property '${attributeKey}' is not a valid attribute for <${tag}> or the Global configuration registry`,
        );
      }
      parseValueAgainstDSL(keywords, dsl, value);
    }
  }

  const innerHTMLConfig = tagDefinition.innerHTML;
  const isVoidElement =
    Array.isArray(innerHTMLConfig) && innerHTMLConfig.length === 0;

  const innerHTML = record.innerHTML;

  if (isVoidElement) {
    if (innerHTML !== undefined) {
      throw new Error(
        `Validation Error: Tag '<${tag}>' is configured as a void element and must not contain any innerHTML or children`,
      );
    }
    return;
  }

  if (innerHTML === undefined) {
    return;
  }

  const isWildcard = innerHTMLConfig === "*";
  const ownList = Array.isArray(innerHTMLConfig) ? innerHTMLConfig : [];
  const declaresText = ownList.includes("#text");
  const allowsText = isWildcard || declaresText;

  let childAllowed: AllowedTagSet;
  let forwardAllowed: AllowedTagSet;
  if (isWildcard) {
    childAllowed = inheritedAllowed;
    forwardAllowed = inheritedAllowed;
  } else if (declaresText) {
    const intersected = intersectAllowed(inheritedAllowed, ownList);
    childAllowed = intersected;
    forwardAllowed = intersected;
  } else {
    childAllowed = new Set(ownList);
    forwardAllowed = inheritedAllowed;
  }

  if (typeof innerHTML === "string") {
    if (!allowsText) {
      throw new Error(
        `Validation Error: Tag '<${tag}>' innerHTML cannot contain a string without the #text`,
      );
    }
    return;
  }

  for (const child of Object.values(innerHTML)) {
    if (typeof child === "string") {
      if (!allowsText) {
        throw new Error(
          `Validation Error: Tag '<${tag}>' innerHTML cannot contain a string without the #text`,
        );
      }
      continue;
    }
    const childTag =
      child !== null && typeof child === "object"
        ? (child as BaseComponentStructure).tag
        : undefined;
    if (
      childAllowed !== null &&
      typeof childTag === "string" &&
      !childAllowed.has(childTag)
    ) {
      throw new Error(
        `Structural Error: '<${childTag}>' is not a permitted child of <${tag}>`,
      );
    }
    validateComponentNode(
      child,
      keywords,
      globalAttributes,
      tagConfig,
      forwardAllowed,
    );
  }
}

export function createComponent<
  const Keywords extends SupportedKeywordsConfig,
  const HTMLAttributesConfig extends BaseHTMLAttributesConfig,
  const HTMLTagConfig extends BaseHTMLTagConfig,
  const CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  const CSSAttributesConfig extends BaseCSSAttributesConfig,
  const CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  const CSSPropertiesConfig extends BaseCSSPropertiesConfig,
  const T extends BaseComponentStructure,
>(
  supportedKeywords: Keywords,
  htmlAttributesConfig: HTMLAttributesConfig,
  htmlTagConfig: HTMLTagConfig,
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
    T,
    keyof HTMLTagConfig | "#text"
  >,
) {
  validateComponentNode(
    config,
    supportedKeywords,
    htmlAttributesConfig,
    htmlTagConfig,
    null,
  );
  return config as T;
}
