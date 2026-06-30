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
    cssPseudoElement: ["::before", "::after", "::selection"],
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
    cssPseudoElement: ["::before", "::after", "::selection"],
  },
  div: {
    attributes: {},
    innerHTML: "*",
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::first-letter", "::first-line", "::selection"],
  },
  h1: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::first-letter", "::first-line", "::selection"],
  },
  h2: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::first-letter", "::first-line", "::selection"],
  },
  h3: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::first-letter", "::first-line", "::selection"],
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
    cssPseudoElement: ["::placeholder", "::file-selector-button"],
  },
  li: {
    attributes: {},
    innerHTML: "*",
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::first-letter", "::first-line", "::selection", "::marker"],
  },
  p: {
    attributes: {},
    innerHTML: ["#text", "span", "a", "br"],
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::first-letter", "::first-line", "::selection"],
  },
  span: {
    attributes: {},
    innerHTML: "*",
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::selection"],
  },
  ul: {
    attributes: {},
    innerHTML: ["li"],
    cssPseudoClass: [],
    cssPseudoElement: ["::before", "::after", "::first-letter", "::first-line", "::selection"],
  },
});
