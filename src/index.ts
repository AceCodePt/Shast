// Let's first describe the basic types

import { cssPropertiesConfig } from "./css/properties-config/index.ts";
import {
  CSS_ATTRIBUTES,
  CSS_SYNTAX,
  HTML_GLOBAL_ATTRIBUTES,
  HTML_TAG_DEFINITIONS,
} from "./consts.ts";
import { createComponent } from "./create-component.ts";
import { SUPPORTED_KEYWORDS } from "./dsl/index.ts";

export const CSS_PROPERTIES = cssPropertiesConfig(
  SUPPORTED_KEYWORDS,
  CSS_SYNTAX,
  {
    "--a": {
      syntax: "<alpha-value>",
      inherits: true,
      "initial-value": "1%",
    },
    "--_a": {
      syntax: "<integer>",
      inherits: false,
      "initial-value": "1",
    },
    "--background-color": {
      syntax: "<color>",
      inherits: false,
      "initial-value": "hsl(1 1% 1%)",
    },
  },
);

// Abstract Syntax tree
const card = createComponent(
  SUPPORTED_KEYWORDS,
  HTML_GLOBAL_ATTRIBUTES,
  HTML_TAG_DEFINITIONS,
  CSS_SYNTAX,
  CSS_ATTRIBUTES,
  CSS_PROPERTIES,
  {
    tag: "div",
    attributes: {},
    innerHTML: {
      img: {
        tag: "img",
      },
      title: {
        tag: "h1",
      },
      points: {
        tag: "ul",
        innerHTML: {
          point: {
            tag: "li",
          },
        },
      },
    },
    css: {
      width: "100%",
      height: "100%",
      "--background-color": "currentColor",
      "> points": {
        padding: "10px",
        "> point": {},
      },
    },
  },
);

// console.log(
//   renderComponent(
//     HTML_TAG_DEFINITIONS,
//     CARD_COMPONENT("", "title", "description"),
//   ),
// );
