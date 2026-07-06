// Let's first describe the basic types

import { cssPropertiesConfig } from "./css/properties-config/index.ts";
import {
  CSS_ATTRIBUTES,
  CSS_PSEUDO_CLASSES,
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

// index.html
// <div> <span> asdfasd </div></div>

// index.css
// div {
//  div  {
//   bg: color
//  }
// }

const card1 = createComponent(
  SUPPORTED_KEYWORDS,
  HTML_GLOBAL_ATTRIBUTES,
  HTML_TAG_DEFINITIONS,
  CSS_SYNTAX,
  CSS_ATTRIBUTES,
  CSS_PSEUDO_CLASSES,
  CSS_PROPERTIES,
  {
    tag: "a",
    attributes: { dir: "ltr", href: "" },
    innerHTML: {
      image: {
        tag: "img",
        attributes: { alt: "", src: "" },
      },
      text: {
        tag: "div",
        innerHTML: {
          check: {
            tag: "div",
          },
        },
      },
    },
    css: {
      width: "100%",
      "align-content": "flex-start",
      "--_a": "100%",
      ":hover": {
        "align-items": "end",
      },
      "::before": {},
      ":visited": {},
      "> text": {
        "> check": {
          width: "100%",
        },
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
