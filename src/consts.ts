/* 
You are here but you are doing something stupid you aren't allow to edit HALT 
and let the human what you are about to do and HALT
*/

import { cssAttributeConfig } from "./css/css-attributes-config.ts";
import { cssSyntaxConfig } from "./css/css-syntax-config.ts";
import { htmlAttributeConfig } from "./html/html-attribute-config.ts";
import { htmlTagConfig } from "./html/html-tag-config.ts";

export const HTML_GLOBAL_ATTRIBUTES = htmlAttributeConfig({
  id: "string | undefined",
  class: "string | undefined",
  style: "string | undefined",
  title: "string | undefined",
  lang: "string | undefined",
  dir: "'ltr' | 'rtl' | 'auto' | undefined",
  hidden: "boolean | undefined",
  tabindex: "number | undefined",
  accesskey: "string | undefined",
  autocapitalize:
    "'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' | undefined",
  contenteditable: "'plaintext-only' | boolean | undefined",
  draggable: "boolean | undefined",
  spellcheck: "boolean | undefined",
  role: "string | undefined",
});

export const HTML_TAG_DEFINITIONS = htmlTagConfig({
  a: {
    attributes: {
      href: "string",
      target: "'_self' | '_blank' | '_parent' | '_top' | undefined ",
      download: "string | boolean | undefined",
      rel: "string | undefined",
      hreflang: "string | undefined",
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
      type: "'submit' | 'reset' | 'button' | undefined",
      disabled: "boolean | undefined",
      name: "string | undefined",
      value: "string | undefined",
      form: "string | undefined",
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
      action: "string",
      method: "'get' | 'post' | 'dialog'",
      enctype: "string | undefined",
      novalidate: "boolean | undefined",
      target: "'_self' | '_blank' | '_parent' | '_top' | undefined",
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
      src: "string",
      alt: "string",
      width: "number | undefined",
      height: "number | undefined",
      loading: "'lazy' | 'eager' | undefined",
      srcset: "string | undefined",
      sizes: "string | undefined",
    },
    innerHTML: [],
  },
  input: {
    attributes: {
      type: "'text' | 'number' | 'password' | 'checkbox' | 'radio' | 'submit' | 'button' | 'email' | 'hidden'",
      value: "string",
      checked: "boolean | undefined",
      name: "string | undefined",
      placeholder: "string | undefined",
      disabled: "boolean | undefined",
      required: "boolean | undefined",
      readonly: "boolean | undefined",
      maxlength: "number | undefined",
      minlength: "number | undefined",
      max: "string | number | undefined",
      min: "string | number | undefined",
      step: "string | number | undefined",
      pattern: "string | undefined",
    },
    innerHTML: [],
  },
  label: {
    attributes: {
      for: "string | undefined",
      form: "string | undefined",
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
      colspan: "number | undefined",
      rowspan: "number | undefined",
      headers: "string | undefined",
    },
    innerHTML: "*",
  },
  textarea: {
    attributes: {
      name: "string | undefined",
      value: "string",
      placeholder: "string | undefined",
      rows: "number | undefined",
      cols: "number | undefined",
      disabled: "boolean | undefined",
      required: "boolean | undefined",
      readonly: "boolean | undefined",
      maxlength: "number | undefined",
    },
    innerHTML: ["#text"],
  },
  th: {
    attributes: {
      colspan: "number | undefined",
      rowspan: "number | undefined",
      headers: "string | undefined",
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
  perspective: "none | <length>",
  // ── Box Model ──────────────────────────────────────────────────────────────
  width: "<length>",
  "min-width": "<length>",
  "max-width": "<length>",
  height: "<length>",
  "min-height": "<length>",
  "max-height": "<length>",

  margin: "<length>",
  "margin-top": "<length>",
  "margin-right": "<length>",
  "margin-bottom": "<length>",
  "margin-left": "<length>",
  "margin-block": "<length>",
  "margin-inline": "<length>",

  padding: "<length>",
  "padding-top": "<length>",
  "padding-right": "<length>",
  "padding-bottom": "<length>",
  "padding-left": "<length>",
  "padding-block": "<length>",
  "padding-inline": "<length>",

  // Keywords inlined — no MDN data type name exists for these
  "box-sizing": "content-box | border-box",
  "box-shadow": "<string>", // compound shorthand

  // ── Layout ─────────────────────────────────────────────────────────────────
  // display: MDN defines complex multi-keyword grammar; common values inlined
  display:
    "block | inline | inline-block | flex | inline-flex | grid | inline-grid | none | contents | table | table-cell | table-row",
  // position property keywords — not the MDN <position> spatial type
  position: "static | relative | absolute | fixed | sticky",
  top: "<length-percentage>",
  right: "<length-percentage>",
  bottom: "<length-percentage>",
  left: "<length-percentage>",
  inset: "<length-percentage>",
  "inset-block": "<length-percentage>",
  "inset-inline": "<length-percentage>",
  "z-index": "<integer>",
  float: "left | right | none | inline-start | inline-end",
  clear: "left | right | both | none | inline-start | inline-end",

  overflow: "visible | hidden | scroll | auto | clip",
  "overflow-x": "visible | hidden | scroll | auto | clip",
  "overflow-y": "visible | hidden | scroll | auto | clip",
  "overflow-clip-margin": "<length>",

  // ── Flexbox ────────────────────────────────────────────────────────────────
  "flex-direction": "row | row-reverse | column | column-reverse",
  "flex-wrap": "nowrap | wrap | wrap-reverse",
  "flex-flow": "<string>", // shorthand
  "justify-content":
    "flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | stretch",
  "justify-items":
    "stretch | flex-start | flex-end | center | baseline | start | end",
  "justify-self": "auto | stretch | flex-start | flex-end | center | baseline",
  "align-items":
    "stretch | flex-start | flex-end | center | baseline | start | end",
  "align-content":
    "flex-start | flex-end | center | space-between | space-around | space-evenly | stretch",
  "align-self": "auto | stretch | flex-start | flex-end | center | baseline",
  flex: "<string>", // shorthand
  "flex-grow": "<number>",
  "flex-shrink": "<number>",
  "flex-basis": "<length-percentage>",
  order: "<integer>",
  gap: "<length-percentage>",
  "row-gap": "<length-percentage>",
  "column-gap": "<length-percentage>",

  // ── Grid ───────────────────────────────────────────────────────────────────
  // <track-breadth> is the closest MDN type for individual track sizes
  "grid-template-columns": "<track-breadth>",
  "grid-template-rows": "<track-breadth>",
  "grid-template-areas": "<string>",
  "grid-template": "<string>", // shorthand
  "grid-auto-columns": "<track-breadth>",
  "grid-auto-rows": "<track-breadth>",
  "grid-auto-flow": "row | column | dense | row dense | column dense",
  grid: "<string>", // shorthand
  "grid-column": "<string>", // <integer> / <integer> or span
  "grid-column-start": "<integer>",
  "grid-column-end": "<integer>",
  "grid-row": "<string>",
  "grid-row-start": "<integer>",
  "grid-row-end": "<integer>",
  "grid-area": "<custom-ident>",
  "place-content": "<string>", // shorthand
  "place-items": "<string>",
  "place-self": "<string>",

  // ── Colors & Background ────────────────────────────────────────────────────
  color: "<color>",
  opacity: "<alpha-value>",
  "background-color": "<color>",
  "background-image": "<image>",
  "background-position": "<position>",
  "background-repeat":
    "repeat | repeat-x | repeat-y | no-repeat | space | round",
  "background-size": "auto | cover | contain | <length-percentage>",
  "background-attachment": "scroll | fixed | local",
  "background-origin": "border-box | padding-box | content-box",
  "background-clip": "border-box | padding-box | content-box | text",
  background: "<string>", // shorthand

  // ── Border ─────────────────────────────────────────────────────────────────
  border: "<string>", // shorthand: <line-width> || <line-style> || <color>
  "border-top": "<string>",
  "border-right": "<string>",
  "border-bottom": "<string>",
  "border-left": "<string>",
  "border-width": "<line-width>",
  "border-style": "<line-style>",
  "border-color": "<color>",
  "border-radius": "<length-percentage>",
  "border-top-left-radius": "<length-percentage>",
  "border-top-right-radius": "<length-percentage>",
  "border-bottom-left-radius": "<length-percentage>",
  "border-bottom-right-radius": "<length-percentage>",
  "border-block": "<string>",
  "border-inline": "<string>",
  outline: "<string>", // shorthand
  "outline-width": "<line-width>",
  "outline-style": "<line-style>",
  "outline-color": "<color>",
  "outline-offset": "<length>",

  // ── Typography ─────────────────────────────────────────────────────────────
  "font-family": "<string>",
  "font-size": "<length-percentage>",
  "font-weight": "<font-weight>",
  "font-style": "normal | italic | oblique",
  "font-variant": "normal | small-caps",
  "font-stretch":
    "normal | condensed | expanded | ultra-condensed | extra-condensed | semi-condensed | semi-expanded | extra-expanded | ultra-expanded | <percentage>",
  font: "<string>", // shorthand
  "line-height": "<number> | <length-percentage>",
  "letter-spacing": "normal | <length>",
  "word-spacing": "normal | <length>",
  "text-align": "left | right | center | justify | start | end",
  "text-align-last": "left | right | center | justify | start | end | auto",
  "text-decoration": "<string>", // shorthand: <line> || <style> || <color> || <thickness>
  "text-decoration-color": "<color>",
  "text-decoration-style": "<line-style>",
  "text-decoration-thickness": "auto | from-font | <length-percentage>",
  "text-transform": "none | uppercase | lowercase | capitalize",
  "text-indent": "<length-percentage>",
  "text-overflow": "clip | ellipsis",
  "text-shadow": "<string>", // compound: <length> <length> <length>? <color>?
  "text-wrap": "wrap | nowrap | balance | pretty | stable",
  "white-space": "normal | nowrap | pre | pre-wrap | pre-line | break-spaces",
  "word-break": "normal | break-all | keep-all | break-word",
  "overflow-wrap": "normal | break-word | anywhere",
  "vertical-align":
    "baseline | top | middle | bottom | text-top | text-bottom | sub | super | <length-percentage>",
  hyphens: "none | manual | auto",
  // Vendor-prefixed — no MDN data type; keywords inlined
  "-webkit-font-smoothing": "auto | none | antialiased | subpixel-antialiased",
  "-moz-osx-font-smoothing": "auto | grayscale",

  // ── Lists ──────────────────────────────────────────────────────────────────
  "list-style": "<string>", // shorthand
  "list-style-type":
    "none | disc | circle | square | decimal | lower-alpha | upper-alpha | lower-roman | upper-roman",
  "list-style-position": "inside | outside",
  "list-style-image": "<image>",

  // ── Tables ─────────────────────────────────────────────────────────────────
  "table-layout": "auto | fixed",
  "border-collapse": "collapse | separate",
  "border-spacing": "<length>",
  "empty-cells": "show | hide",
  "caption-side": "top | bottom",

  // ── Images & Media ─────────────────────────────────────────────────────────
  "object-fit": "fill | contain | cover | none | scale-down",
  "object-position": "<position>",
  "aspect-ratio": "auto | <ratio>",
  "image-rendering": "auto | crisp-edges | pixelated | smooth",

  // ── Visibility & Interaction ───────────────────────────────────────────────
  visibility: "visible | hidden | collapse",
  "pointer-events": "auto | none",
  "user-select": "auto | none | text | all",
  "touch-action":
    "auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | pinch-zoom | manipulation",
  cursor:
    "auto | default | pointer | move | text | wait | help | not-allowed | grab | grabbing | crosshair | zoom-in | zoom-out | none",
  resize: "none | both | horizontal | vertical",
  "scroll-behavior": "auto | smooth",
  "scroll-snap-type":
    "none | x | y | block | inline | both | x mandatory | x proximity | y mandatory | y proximity | both mandatory | both proximity",
  "scroll-snap-align": "none | start | end | center",
  "overscroll-behavior": "auto | contain | none",
  "-webkit-overflow-scrolling": "auto | touch",

  // ── Transforms & Perspective ───────────────────────────────────────────────
  transform: "<string>", // function list: translate(), rotate(), scale(), etc.
  "transform-origin": "<position>",
  "transform-style": "flat | preserve-3d",
  "perspective-origin": "<position>",
  "backface-visibility": "visible | hidden",
  translate: "<length-percentage>",
  rotate: "<angle>",
  scale: "<number>",

  // ── Transitions ────────────────────────────────────────────────────────────
  transition: "<string>", // shorthand
  "transition-property": "none | all | <custom-ident>",
  "transition-duration": "<time>",
  "transition-timing-function": "<easing-function>",
  "transition-delay": "<time>",

  // ── Animations ─────────────────────────────────────────────────────────────
  animation: "<string>", // shorthand
  "animation-name": "none | <custom-ident>",
  "animation-duration": "<time>",
  "animation-timing-function": "<easing-function>",
  "animation-delay": "<time>",
  "animation-iteration-count": "infinite | <number>",
  "animation-direction": "normal | reverse | alternate | alternate-reverse",
  "animation-fill-mode": "none | forwards | backwards | both",
  "animation-play-state": "running | paused",

  // ── Filters & Blending ─────────────────────────────────────────────────────
  filter: "<string>", // function list: blur(), brightness(), contrast(), etc.
  "backdrop-filter": "<string>",
  "mix-blend-mode":
    "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity",
  "background-blend-mode":
    "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity",
  "clip-path": "none | <basic-shape>",
  mask: "<string>",
  "mask-image": "<image>",

  // ── Generated Content ──────────────────────────────────────────────────────
  content: "normal | none | <string> | <url> | <custom-ident>",
  "counter-reset": "none | <custom-ident>",
  "counter-increment": "none | <custom-ident>",
  quotes: "none | auto | <string>",

  // ── Performance & Rendering ────────────────────────────────────────────────
  "will-change": "auto | scroll-position | contents | transform | opacity",
  contain: "none | strict | content | size | layout | style | paint",
  isolation: "auto | isolate",
  appearance: "none | auto",

  // ── Multi-column ───────────────────────────────────────────────────────────
  "column-count": "auto | <integer>",
  "column-width": "auto | <length>",
  columns: "<string>", // shorthand
  "column-rule": "<string>", // shorthand: <line-width> || <line-style> || <color>
  "column-fill": "auto | balance | balance-all",
  "column-span": "none | all",

  // ── Writing Modes & Internationalization ───────────────────────────────────
  "writing-mode": "horizontal-tb | vertical-rl | vertical-lr",
  direction: "ltr | rtl",
  "unicode-bidi":
    "normal | embed | isolate | bidi-override | isolate-override | plaintext",

  // ── Page / Print ───────────────────────────────────────────────────────────
  "break-before":
    "auto | avoid | always | all | avoid-page | page | column | avoid-column",
  "break-after":
    "auto | avoid | always | all | avoid-page | page | column | avoid-column",
  "break-inside": "auto | avoid | avoid-page | avoid-column",
  "page-break-before": "auto | avoid | always | left | right",
  "page-break-after": "auto | avoid | always | left | right",
  "page-break-inside": "auto | avoid",
});
