import { SUPPORTED_KEYWORDS } from "@/dsl/index.ts";
import { htmlTagConfig } from "../index.ts";

export default htmlTagConfig(SUPPORTED_KEYWORDS, {
  a: {
    attributes: {
      href: "string | undefined",
      target: "'_self' | '_blank' | undefined",
    },
    innerHTML: ["#text", "img", "span"],
    cssPseudoClass: [":link", ":visited"],
    cssPseudoElement: [],
  },
  br: {
    attributes: {},
    innerHTML: [],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  button: {
    attributes: {
      type: "'submit' | 'reset' | 'button' | undefined",
      disabled: "boolean | undefined",
    },
    innerHTML: ["#text"],
    cssPseudoClass: [":disabled"],
    cssPseudoElement: [],
  },
  div: {
    attributes: {},
    innerHTML: "*",
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  h1: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  h2: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  h3: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  img: {
    attributes: {
      src: "string",
      alt: "string",
    },
    innerHTML: [],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  input: {
    attributes: {
      type: "'text' | 'number' | 'password' | 'checkbox' | 'radio' | 'submit' | 'hidden'",
      value: "string",
      disabled: "boolean | undefined",
    },
    innerHTML: [],
    cssPseudoClass: [":disabled", ":checked"],
    cssPseudoElement: [],
  },
  li: {
    attributes: {},
    innerHTML: "*",
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  p: {
    attributes: {},
    innerHTML: ["#text", "span", "a", "br"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  span: {
    attributes: {},
    innerHTML: "*",
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  ul: {
    attributes: {},
    innerHTML: ["li"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
});
