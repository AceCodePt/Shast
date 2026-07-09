import {
  validateComponentNode,
  type BaseComponentStructure,
  type ValidateComponentStructure,
} from "./create-component.ts";
import type {
  BaseCSSAttributesConfig,
  ValidateCSSAttributesConfig,
} from "./css/attribute-config/types.ts";
import type {
  BaseCSSPropertiesConfig,
  ValidateCSSPropertiesConfig,
} from "./css/properties-config/types.ts";
import type { BaseCSSPseudoClassConfig } from "./css/pseudo-class-config/types.ts";
import type { SupportedKeywordsConfig } from "./dsl/index.ts";
import type {
  BaseCSSSyntaxConfig,
  ValidateCSSSyntaxConfig,
} from "./css/syntax-config/types.ts";

import type {
  BaseHTMLAttributesConfig,
  ValidateHTMLAttributesConfig,
} from "./html/attribute-config/types.ts";
import type {
  BaseHTMLTagConfig,
  ValidateHTMLTagConfig,
} from "./html/tag-config/types.ts";
import { renderCSSPropertiesConfig } from "./render/properties-config.ts";
import { renderComponent } from "./render/render-component.ts";

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
      HTMLGlobalAttributesConfig,
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

  return {
    createComponent: createComponent,
    renderComponent: renderComponent,
    cssProperties: renderCSSPropertiesConfig(config.cssPropertiesConfig),
  };
}
