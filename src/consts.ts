/* 
You are here but you are doing something stupid you aren't allow to edit HALT 
and let the human what you are about to do and HALT
*/

import { cssAttributeConfig } from "./css/css-attributes-config.ts";
import { cssSyntaxConfig } from "./css/css-syntax-config.ts";
import { htmlAttributeConfig } from "./html/html-attribute-config.ts";
import { htmlTagConfig } from "./html/html-tag-config.ts";

export const HTML_GLOBAL_ATTRIBUTES = htmlAttributeConfig({
  id: "" as string | undefined,
  class: "" as string | undefined,
  style: "" as string | undefined,
  title: "" as string | undefined,
  lang: "" as string | undefined,
  dir: "" as "ltr" | "rtl" | "auto" | undefined,
  hidden: false as boolean | undefined,
  tabindex: 0 as number | undefined,
  accesskey: "" as string | undefined,
  autocapitalize: "" as
    | "off"
    | "none"
    | "on"
    | "sentences"
    | "words"
    | "characters"
    | undefined,
  contenteditable: "" as
    | "true"
    | "false"
    | "plaintext-only"
    | boolean
    | undefined,
  draggable: "" as "true" | "false" | boolean | undefined,
  spellcheck: "" as "true" | "false" | boolean | undefined,
  role: "" as string | undefined,
});

export const HTML_TAG_DEFINITIONS = htmlTagConfig({
  a: {
    attributes: {
      href: "" as string,
      target: "_self" as "_self" | "_blank" | "_parent" | "_top" | undefined,
      download: "" as string | boolean | undefined,
      rel: "" as string | undefined,
      hreflang: "" as string | undefined,
    },
    innerHTML: [
      "#text",
      "img",
      "div",
      "section",
      "p",
      "ul",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
  },
  article: {
    innerHTML: "*",
  },
  button: {
    attributes: {
      type: "submit" as "submit" | "reset" | "button" | undefined,
      disabled: false as boolean | undefined,
      name: "" as string | undefined,
      value: "" as string | undefined,
      form: "" as string | undefined,
    },
    innerHTML: ["#text", "span", "img"],
  },
  div: {
    innerHTML: "*",
  },
  footer: {
    innerHTML: "*",
  },
  form: {
    attributes: {
      action: "" as string,
      method: "get" as "get" | "post" | "dialog",
      enctype: "" as string | undefined,
      novalidate: false as boolean | undefined,
      target: "_self" as "_self" | "_blank" | "_parent" | "_top" | undefined,
    },
    innerHTML: "*",
  },
  h1: {
    innerHTML: ["#text", "span", "a"],
  },
  h2: {
    innerHTML: ["#text", "span", "a"],
  },
  h3: {
    innerHTML: ["#text", "span", "a"],
  },
  h4: {
    innerHTML: ["#text", "span", "a"],
  },
  h5: {
    innerHTML: ["#text", "span", "a"],
  },
  h6: {
    innerHTML: ["#text", "span", "a"],
  },
  header: {
    innerHTML: "*",
  },
  img: {
    attributes: {
      src: "" as string,
      alt: "" as string,
      width: 0 as number | undefined,
      height: 0 as number | undefined,
      loading: "lazy" as "lazy" | "eager" | undefined,
      srcset: "" as string | undefined,
      sizes: "" as string | undefined,
    },
    innerHTML: [],
  },
  input: {
    attributes: {
      type: "text" as
        | "text"
        | "number"
        | "password"
        | "checkbox"
        | "radio"
        | "submit"
        | "button"
        | "email"
        | "hidden",
      value: "",
      checked: false as boolean | undefined,
      name: "" as string | undefined,
      placeholder: "" as string | undefined,
      disabled: false as boolean | undefined,
      required: false as boolean | undefined,
      readonly: false as boolean | undefined,
      maxlength: 0 as number | undefined,
      minlength: 0 as number | undefined,
      max: "" as string | number | undefined,
      min: "" as string | number | undefined,
      step: "" as string | number | undefined,
      pattern: "" as string | undefined,
    },
    innerHTML: [],
  },
  label: {
    attributes: {
      for: "" as string | undefined,
      form: "" as string | undefined,
    },
    innerHTML: ["#text", "input", "span", "img"],
  },
  li: {
    innerHTML: "*",
  },
  main: {
    innerHTML: "*",
  },
  nav: {
    innerHTML: "*",
  },
  ol: {
    innerHTML: ["li"],
  },
  p: {
    innerHTML: "*",
  },
  section: {
    innerHTML: "*",
  },
  span: {
    innerHTML: "*",
  },
  table: {
    innerHTML: ["thead", "tbody", "tr"],
  },
  tbody: {
    innerHTML: ["tr"],
  },
  td: {
    attributes: {
      colspan: 0 as number | undefined,
      rowspan: 0 as number | undefined,
      headers: "" as string | undefined,
    },
    innerHTML: "*",
  },
  textarea: {
    attributes: {
      name: "" as string | undefined,
      value: "" as string,
      placeholder: "" as string | undefined,
      rows: 0 as number | undefined,
      cols: 0 as number | undefined,
      disabled: false as boolean | undefined,
      required: false as boolean | undefined,
      readonly: false as boolean | undefined,
      maxlength: 0 as number | undefined,
    },
    innerHTML: ["#text"],
  },
  th: {
    attributes: {
      colspan: 0 as number | undefined,
      rowspan: 0 as number | undefined,
      headers: "" as string | undefined,
    },
    innerHTML: "*",
  },
  thead: {
    innerHTML: ["tr"],
  },
  tr: {
    innerHTML: ["th", "td"],
  },
  ul: {
    innerHTML: ["li"],
  },
});

export const CSS_SYNTAX = cssSyntaxConfig({
  // ── MDN numeric / dimension types ─────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/integer
  "<integer>": "" as `${bigint}`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/number
  "<number>": "" as `${number}`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/percentage
  "<percentage>": "" as `${number}%`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/length
  "<length>":
    "" as `${number}${"px" | "rem" | "em" | "vw" | "vh" | "vmin" | "vmax" | "ch" | "lh" | "dvh" | "dvw" | "svh" | "svw" | "in" | "pt" | "pc" | "cm" | "mm"}`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage
  "<length-percentage>": "" as "<length>" | "<percentage>",

  // https://developer.mozilla.org/en-US/docs/Web/CSS/angle
  "<angle>": "" as `${number}${"deg" | "rad" | "turn" | "grad"}`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/time
  "<time>": "" as `${number}${"s" | "ms"}`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/ratio
  "<ratio>": "" as `${number} / ${number}`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/flex_value  (the fr unit)
  "<flex>": "" as `${number}fr`,

  // ── MDN textual types ──────────────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/string
  "<string>": "" as string,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/url_value
  "<url>": "" as `url(${string})`,

  // https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident
  "<custom-ident>": "" as string,

  // ── MDN color types ────────────────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
  "<color>": "" as
    | `#${string}`
    | `rgb(${number} ${number} ${number})`
    | `rgb(${number} ${number} ${number} / ${number})`
    | `hsl(${number} ${number}% ${number}%)`
    | `hsl(${number} ${number}% ${number}% / ${number})`
    | `oklch(${number} ${number} ${number})`
    | `oklch(${number} ${number} ${number} / ${number})`
    | `color(display-p3 ${number} ${number} ${number})`
    | "transparent"
    | "currentColor"
    | "inherit",

  // https://developer.mozilla.org/en-US/docs/Web/CSS/alpha-value
  "<alpha-value>": "" as `${number}` | `${number}%`,

  // ── MDN image type ─────────────────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/image
  // Covers url(), linear-gradient(), etc. — kept as url() for the common case;
  // gradient functions are compound shorthands typed as <string> at usage sites.
  "<image>": "" as
    | `url(${string})`
    | `linear-gradient(${string})`
    | `radial-gradient(${string})`,

  // ── MDN 2D position type ───────────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/position_value
  // Used by background-position, transform-origin, object-position, etc.
  "<position>": "" as
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top left"
    | "top center"
    | "top right"
    | "center left"
    | "center center"
    | "center right"
    | "bottom left"
    | "bottom center"
    | "bottom right"
    | "<length-percentage>",

  // ── MDN easing-function type ───────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
  "<easing-function>": "" as
    | "ease"
    | "ease-in"
    | "ease-out"
    | "ease-in-out"
    | "linear"
    | `cubic-bezier(${number}, ${number}, ${number}, ${number})`
    | `steps(${number})`
    | `steps(${number}, ${"start" | "end" | "jump-start" | "jump-end" | "jump-none" | "jump-both"})`,

  // ── MDN line-style type ────────────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/line-style
  "<line-style>": "" as
    | "none"
    | "hidden"
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset",

  // ── MDN line-width type ────────────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/line-width
  "<line-width>": "" as "thin" | "medium" | "thick" | "<length>",

  // ── MDN basic-shape type ───────────────────────────────────────────────────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape
  // Kept as string — compound function syntax (inset, circle, polygon, path…)
  "<basic-shape>": "" as string,

  // ── Grid-specific types (defined in CSS Grid spec, referenced by MDN) ──────
  // https://developer.mozilla.org/en-US/docs/Web/CSS/flex_value
  // <flex> covers fr; track sizing uses <length-percentage> | <flex> | keywords
  "<track-breadth>": "" as
    | "<length-percentage>"
    | "<flex>"
    | "min-content"
    | "max-content"
    | "auto",

  // ── font-weight numeric values (MDN lists 100–900 as valid <number> inputs) ─
  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
  "<font-weight>": "" as
    | "normal"
    | "bold"
    | "bolder"
    | "lighter"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900",
});

export const CSS_ATTRIBUTES = cssAttributeConfig(CSS_SYNTAX, {
  width: "<length> | check",
});
