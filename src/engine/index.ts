import type {
  BaseCSSAttributesConfig,
  ValidateCSSAttributesConfig,
} from "@/css/attribute-config/types.ts";
import type {
  BaseCSSPropertiesConfig,
  ValidateCSSPropertiesConfig,
} from "@/css/properties-config/types.ts";
import type { BaseCSSPseudoClassConfig } from "@/css/pseudo-class-config/types.ts";
import type {
  BaseCSSSyntaxConfig,
  ValidateCSSSyntaxConfig,
} from "@/css/syntax-config/types.ts";
import {
  parseValueAgainstDSL,
  type SupportedKeywordsConfig,
} from "@/dsl/index.ts";
import type {
  BaseHTMLAttributesConfig,
  InferHTMLAttributesConfig,
  ValidateHTMLAttributesConfig,
} from "@/html/attribute-config/types.ts";
import type {
  BaseHTMLTagConfig,
  ValidateHTMLTagConfig,
} from "@/html/tag-config/types.ts";
import { renderCSSPropertiesConfig } from "@/engine/render/properties-config.ts";
import { renderComponent } from "@/engine/render/render-component.ts";
import type { MakeUndefinedOptional } from "@/types.ts";
import type {
  BaseComponentStructure,
  ValidateComponentStructure,
} from "@/engine/types.ts";

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

  const innerHTML =
    "innerHTML" in record && record["innerHTML"]
      ? record["innerHTML"]
      : undefined;

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

export default function engine<
  const SupportedKeywords extends SupportedKeywordsConfig,
  const HTMLGlobalAttributesConfig extends BaseHTMLAttributesConfig,
  const HTMLTagConfig extends BaseHTMLTagConfig,
  const CSSSyntaxConfig extends BaseCSSSyntaxConfig,
  const CSSAttributesConfig extends BaseCSSAttributesConfig,
  const CSSPseudoClassConfig extends BaseCSSPseudoClassConfig,
  const CSSPropertiesConfig extends BaseCSSPropertiesConfig,
>(config: {
  supportedKeywords: SupportedKeywords;
  htmlAttributesConfig: ValidateHTMLAttributesConfig<
    SupportedKeywords,
    HTMLGlobalAttributesConfig
  >;
  htmlTagConfig: ValidateHTMLTagConfig<SupportedKeywords, HTMLTagConfig>;
  cssSyntaxConfig: ValidateCSSSyntaxConfig<SupportedKeywords, CSSSyntaxConfig>;
  cssAttributesConfig: ValidateCSSAttributesConfig<
    SupportedKeywords,
    CSSSyntaxConfig,
    CSSAttributesConfig
  >;
  cssPseudoClassConfig: CSSPseudoClassConfig;
  cssPropertiesConfig: ValidateCSSPropertiesConfig<
    SupportedKeywords,
    CSSSyntaxConfig,
    CSSPropertiesConfig
  >;
}) {
  const createComponent = <const T extends BaseComponentStructure>(
    componentStructure: ValidateComponentStructure<
      SupportedKeywords,
      MakeUndefinedOptional<
        InferHTMLAttributesConfig<SupportedKeywords, HTMLGlobalAttributesConfig>
      >,
      HTMLTagConfig,
      CSSSyntaxConfig,
      CSSAttributesConfig,
      CSSPseudoClassConfig,
      CSSPropertiesConfig,
      keyof HTMLTagConfig | "#text",
      T,
      keyof HTMLTagConfig | "#text"
    >,
  ) => {
    validateComponentNode(
      componentStructure,
      config.supportedKeywords,
      config.htmlAttributesConfig,
      config.htmlTagConfig,
      null,
    );
    return componentStructure as T;
  };

  const renderComponentBound = <const T extends BaseComponentStructure>(
    componentStructure: T,
  ) => {
    return renderComponent(config.htmlTagConfig, componentStructure);
  };

  return {
    createComponent: createComponent,
    renderComponent: renderComponentBound,
    cssProperties: renderCSSPropertiesConfig(config.cssPropertiesConfig),
  };
}
