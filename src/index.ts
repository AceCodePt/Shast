import { cssPropertiesConfig } from "./css/properties-config/index.ts";
import {
  CSS_ATTRIBUTES_CONFIG,
  CSS_GLOBAL_PSEUDO_CLASSES_CONFIG,
  CSS_SYNTAX_CONFIG,
  HTML_GLOBAL_ATTRIBUTES_CONFIG,
  HTML_TAGS_CONFIG,
} from "./consts.ts";
import { SUPPORTED_KEYWORDS } from "./dsl/index.ts";
import engine from "./engine.ts";

export const CSS_GLOBAL_PROPERTIES = cssPropertiesConfig(
  SUPPORTED_KEYWORDS,
  CSS_SYNTAX_CONFIG,
  {
    "--a": {
      syntax: "<alpha-value>",
      inherits: true,
      "initial-value": "1%",
    },
    "--_a": {
      syntax: "<percentage>",
      inherits: false,
      "initial-value": "1%",
    },
    "--background-color": {
      syntax: "<color>",
      inherits: false,
      "initial-value": "hsl(1 1% 1%)",
    },
  },
);

const { createComponent } = engine({
  supportedKeywords: SUPPORTED_KEYWORDS,
  htmlAttributesConfig: HTML_GLOBAL_ATTRIBUTES_CONFIG,
  htmlTagConfig: HTML_TAGS_CONFIG,
  cssSyntaxConfig: CSS_SYNTAX_CONFIG,
  cssAttributesConfig: CSS_ATTRIBUTES_CONFIG,
  cssPseudoClassConfig: CSS_GLOBAL_PSEUDO_CLASSES_CONFIG,
  cssPropertiesConfig: CSS_GLOBAL_PROPERTIES,
});

createComponent({
  tag: "a",
  css: {
    width: "100px",
  },
});

// const card =
createComponent({
  tag: "a",
  attributes: { dir: "ltr", href: "" },
  innerHTML: {
    image: {
      tag: "img",
      attributes: { alt: "", src: "" },
    },
    content: {
      tag: "div",
      innerHTML: {
        title: {
          tag: "h1",
          innerHTML: "My awesome product",
        },
        subtitle: {
          tag: "h1",
          innerHTML: "Small description about production",
        },
      },
    },
  },
  css: {
    width: "100px",
    "align-content": "flex-start",
    "--_a": "100%",
    ":hover": {
      "align-items": "end",
    },
    "::before": {},
    ":visited": {},
    "> content": {
      "> title": {
        color: "hsl(1 1% 1%)",
      },
      "> subtitle": {},
    },
  },
});

// console.log(
//   renderComponent(
//     HTML_TAG_DEFINITIONS,
//     CARD_COMPONENT("", "title", "description"),
//   ),
// );
