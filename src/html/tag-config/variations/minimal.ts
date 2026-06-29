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
  },
  br: {
    innerHTML: [],
  },
  button: {
    attributes: {
      type: "'submit' | 'reset' | 'button' | undefined",
      disabled: "boolean | undefined",
    },
    innerHTML: ["#text"],
    cssPseudoClass: [":disabled"],
  },
  div: {
    innerHTML: "*",
  },
  h1: {
    innerHTML: ["#text"],
  },
  h2: {
    innerHTML: ["#text"],
  },
  h3: {
    innerHTML: ["#text"],
  },
  img: {
    attributes: {
      src: "string",
      alt: "string",
    },
    innerHTML: [],
  },
  input: {
    attributes: {
      type: "'text' | 'number' | 'password' | 'checkbox' | 'radio' | 'submit' | 'hidden'",
      value: "string",
      disabled: "boolean | undefined",
    },
    innerHTML: [],
    cssPseudoClass: [":disabled", ":checked"],
  },
  li: {
    innerHTML: "*",
  },
  p: {
    innerHTML: ["#text", "span", "a", "br"],
  },
  span: {
    innerHTML: "*",
  },
  ul: {
    innerHTML: ["li"],
  },
});
