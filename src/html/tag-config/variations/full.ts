import { SUPPORTED_KEYWORDS } from "@/dsl/index.ts";
import { htmlTagConfig } from "../index.ts";

export default htmlTagConfig(SUPPORTED_KEYWORDS, {
  // ─── Text & Inline ─────────────────────────────────────────────────
  a: {
    attributes: {
      href: "string | undefined",
      target: "'_self' | '_blank' | '_parent' | '_top' | undefined",
      download: "string | boolean | undefined",
      rel: "string | undefined",
      hreflang: "string | undefined",
      ping: "string | undefined",
      referrerpolicy:
        "'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | undefined",
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
      "span",
      "abbr",
      "cite",
      "code",
      "em",
      "strong",
      "time",
    ],
    cssPseudoClass: [":link", ":visited", ":any-link", ":local-link"],
  },
  abbr: {
    attributes: {
      title: "string | undefined",
    },
    innerHTML: ["#text"],
  },
  address: {
    innerHTML: "*",
  },
  b: {
    innerHTML: ["#text", "span", "a", "em", "strong"],
  },
  bdi: {
    attributes: {
      dir: "'ltr' | 'rtl' | 'auto' | undefined",
    },
    innerHTML: ["#text"],
  },
  bdo: {
    attributes: {
      dir: "'ltr' | 'rtl'",
    },
    innerHTML: ["#text"],
  },
  blockquote: {
    attributes: {
      cite: "string | undefined",
    },
    innerHTML: "*",
  },
  br: {
    innerHTML: [],
  },
  cite: {
    innerHTML: ["#text", "a"],
  },
  code: {
    innerHTML: ["#text"],
  },
  data: {
    attributes: {
      value: "string",
    },
    innerHTML: ["#text"],
  },
  dfn: {
    attributes: {
      title: "string | undefined",
    },
    innerHTML: ["#text", "abbr"],
  },
  em: {
    innerHTML: ["#text", "span", "a", "strong"],
  },
  i: {
    innerHTML: ["#text", "span"],
  },
  kbd: {
    innerHTML: ["#text", "kbd"],
  },
  mark: {
    innerHTML: ["#text"],
  },
  q: {
    attributes: {
      cite: "string | undefined",
    },
    innerHTML: ["#text"],
  },
  rp: {
    innerHTML: ["#text"],
  },
  rt: {
    innerHTML: ["#text"],
  },
  ruby: {
    innerHTML: ["#text", "rp", "rt"],
  },
  s: {
    innerHTML: ["#text"],
  },
  samp: {
    innerHTML: ["#text"],
  },
  small: {
    innerHTML: ["#text", "span"],
  },
  span: {
    innerHTML: "*",
  },
  strong: {
    innerHTML: ["#text", "span", "a", "em"],
  },
  sub: {
    innerHTML: ["#text"],
  },
  sup: {
    innerHTML: ["#text"],
  },
  time: {
    attributes: {
      datetime: "string | undefined",
    },
    innerHTML: ["#text"],
  },
  u: {
    innerHTML: ["#text"],
  },
  var: {
    innerHTML: ["#text"],
  },
  wbr: {
    innerHTML: [],
  },

  // ─── Headings ──────────────────────────────────────────────────────
  h1: {
    innerHTML: ["#text", "span", "a", "em", "strong", "small", "abbr"],
  },
  h2: {
    innerHTML: ["#text", "span", "a", "em", "strong", "small", "abbr"],
  },
  h3: {
    innerHTML: ["#text", "span", "a", "em", "strong", "small", "abbr"],
  },
  h4: {
    innerHTML: ["#text", "span", "a", "em", "strong", "small", "abbr"],
  },
  h5: {
    innerHTML: ["#text", "span", "a", "em", "strong", "small", "abbr"],
  },
  h6: {
    innerHTML: ["#text", "span", "a", "em", "strong", "small", "abbr"],
  },
  hgroup: {
    innerHTML: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
  },

  // ─── Sectioning & Layout ───────────────────────────────────────────
  article: {
    innerHTML: "*",
  },
  aside: {
    innerHTML: "*",
  },
  details: {
    attributes: {
      open: "boolean | undefined",
    },
    innerHTML: ["summary", "div", "p", "ul", "ol", "table"],
    cssPseudoClass: [":open"],
  },
  dialog: {
    attributes: {
      open: "boolean | undefined",
    },
    innerHTML: "*",
    cssPseudoClass: [":open", ":modal"],
  },
  div: {
    innerHTML: "*",
  },
  footer: {
    innerHTML: "*",
  },
  header: {
    innerHTML: "*",
  },
  main: {
    innerHTML: "*",
  },
  nav: {
    innerHTML: "*",
  },
  p: {
    innerHTML: [
      "#text",
      "span",
      "a",
      "img",
      "input",
      "br",
      "label",
      "abbr",
      "b",
      "cite",
      "code",
      "em",
      "i",
      "kbd",
      "mark",
      "q",
      "s",
      "samp",
      "small",
      "strong",
      "sub",
      "sup",
      "time",
      "u",
      "var",
      "wbr",
    ],
  },
  search: {
    innerHTML: "*",
  },
  section: {
    innerHTML: "*",
  },
  summary: {
    innerHTML: ["#text", "span", "a", "em", "strong"],
  },

  // ─── Lists ─────────────────────────────────────────────────────────
  dd: {
    innerHTML: "*",
  },
  dl: {
    innerHTML: ["dt", "dd"],
  },
  dt: {
    innerHTML: ["#text", "span", "a", "abbr", "em", "strong"],
  },
  li: {
    innerHTML: "*",
  },
  menu: {
    innerHTML: ["li"],
  },
  ol: {
    attributes: {
      reversed: "boolean | undefined",
      start: "number | undefined",
      type: "'1' | 'a' | 'A' | 'i' | 'I' | undefined",
    },
    innerHTML: ["li"],
  },
  ul: {
    innerHTML: ["li"],
  },

  // ─── Media ─────────────────────────────────────────────────────────
  audio: {
    attributes: {
      src: "string | undefined",
      controls: "boolean | undefined",
      autoplay: "boolean | undefined",
      loop: "boolean | undefined",
      muted: "boolean | undefined",
      preload: "'none' | 'metadata' | 'auto' | undefined",
    },
    innerHTML: ["source", "track"],
    cssPseudoClass: [
      ":playing",
      ":paused",
      ":muted",
      ":volume-locked",
      ":seeking",
      ":buffering",
      ":stalled",
    ],
  },
  canvas: {
    attributes: {
      width: "number | undefined",
      height: "number | undefined",
    },
    innerHTML: ["#text"],
  },
  figcaption: {
    innerHTML: "*",
  },
  figure: {
    innerHTML: ["img", "video", "audio", "canvas", "picture", "figcaption"],
  },
  iframe: {
    attributes: {
      src: "string | undefined",
      srcdoc: "string | undefined",
      name: "string | undefined",
      width: "number | undefined",
      height: "number | undefined",
      allow: "string | undefined",
      allowfullscreen: "boolean | undefined",
      loading: "'lazy' | 'eager' | undefined",
      referrerpolicy:
        "'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | undefined",
      sandbox: "string | undefined",
    },
    innerHTML: [],
    cssPseudoClass: [":fullscreen"],
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
      crossorigin: "'anonymous' | 'use-credentials' | undefined",
      decoding: "'sync' | 'async' | 'auto' | undefined",
      fetchpriority: "'high' | 'low' | 'auto' | undefined",
      ismap: "boolean | undefined",
      usemap: "string | undefined",
      referrerpolicy:
        "'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | undefined",
    },
    innerHTML: [],
  },
  picture: {
    innerHTML: ["source", "img"],
  },
  source: {
    attributes: {
      src: "string | undefined",
      srcset: "string | undefined",
      sizes: "string | undefined",
      type: "string | undefined",
      media: "string | undefined",
      width: "number | undefined",
      height: "number | undefined",
    },
    innerHTML: [],
  },
  track: {
    attributes: {
      kind: "'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata' | undefined",
      src: "string",
      srclang: "string | undefined",
      label: "string | undefined",
      default: "boolean | undefined",
    },
    innerHTML: [],
  },
  video: {
    attributes: {
      src: "string | undefined",
      controls: "boolean | undefined",
      autoplay: "boolean | undefined",
      loop: "boolean | undefined",
      muted: "boolean | undefined",
      preload: "'none' | 'metadata' | 'auto' | undefined",
      width: "number | undefined",
      height: "number | undefined",
      poster: "string | undefined",
      playsinline: "boolean | undefined",
    },
    innerHTML: ["source", "track"],
    cssPseudoClass: [
      ":playing",
      ":paused",
      ":muted",
      ":volume-locked",
      ":seeking",
      ":buffering",
      ":stalled",
      ":picture-in-picture",
    ],
  },

  // ─── Forms ─────────────────────────────────────────────────────────
  button: {
    attributes: {
      type: "'submit' | 'reset' | 'button' | undefined",
      disabled: "boolean | undefined",
      name: "string | undefined",
      value: "string | undefined",
      form: "string | undefined",
      formaction: "string | undefined",
      formenctype:
        "'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain' | undefined",
      formmethod: "'get' | 'post' | 'dialog' | undefined",
      formnovalidate: "boolean | undefined",
      formtarget: "'_self' | '_blank' | '_parent' | '_top' | undefined",
      popovertarget: "string | undefined",
      popovertargetaction: "'show' | 'hide' | 'toggle' | undefined",
    },
    innerHTML: ["#text", "span", "img", "em", "strong"],
    cssPseudoClass: [":disabled", ":enabled", ":default"],
  },
  datalist: {
    innerHTML: ["option"],
  },
  fieldset: {
    attributes: {
      disabled: "boolean | undefined",
      form: "string | undefined",
      name: "string | undefined",
    },
    innerHTML: ["legend", "div", "p", "input", "label", "select", "textarea"],
    cssPseudoClass: [":disabled"],
  },
  form: {
    attributes: {
      action: "string",
      method: "'get' | 'post' | 'dialog'",
      enctype:
        "'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain' | undefined",
      novalidate: "boolean | undefined",
      target: "'_self' | '_blank' | '_parent' | '_top' | undefined",
      autocomplete: "'on' | 'off' | undefined",
      name: "string | undefined",
      rel: "string | undefined",
    },
    innerHTML: "*",
    cssPseudoClass: [":valid", ":invalid", ":user-invalid"],
  },
  input: {
    attributes: {
      type: "'text' | 'number' | 'password' | 'checkbox' | 'radio' | 'submit' | 'button' | 'email' | 'hidden' | 'file' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'range' | 'search' | 'tel' | 'url' | 'image' | 'reset'",
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
      hidden: "boolean | undefined",
      autocomplete: "string | undefined",
      autofocus: "boolean | undefined",
      form: "string | undefined",
      list: "string | undefined",
      multiple: "boolean | undefined",
      size: "number | undefined",
      accept: "string | undefined",
      capture: "'user' | 'environment' | undefined",
      dirname: "string | undefined",
      formaction: "string | undefined",
      formenctype:
        "'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain' | undefined",
      formmethod: "'get' | 'post' | 'dialog' | undefined",
      formnovalidate: "boolean | undefined",
      formtarget: "'_self' | '_blank' | '_parent' | '_top' | undefined",
      height: "number | undefined",
      width: "number | undefined",
      src: "string | undefined",
      alt: "string | undefined",
      popovertarget: "string | undefined",
      popovertargetaction: "'show' | 'hide' | 'toggle' | undefined",
    },
    innerHTML: [],
    cssPseudoClass: [
      ":disabled",
      ":enabled",
      ":checked",
      ":indeterminate",
      ":default",
      ":valid",
      ":invalid",
      ":in-range",
      ":out-of-range",
      ":required",
      ":optional",
      ":placeholder-shown",
      ":user-invalid",
      ":autofill",
    ],
  },
  label: {
    attributes: {
      for: "string | undefined",
      form: "string | undefined",
    },
    innerHTML: ["#text", "input", "span", "img", "abbr", "em", "strong"],
  },
  legend: {
    innerHTML: ["#text", "span", "a", "label"],
  },
  meter: {
    attributes: {
      value: "number",
      min: "number | undefined",
      max: "number | undefined",
      low: "number | undefined",
      high: "number | undefined",
      optimum: "number | undefined",
      form: "string | undefined",
    },
    innerHTML: ["#text"],
    cssPseudoClass: [":valid", ":invalid", ":in-range", ":out-of-range"],
  },
  optgroup: {
    attributes: {
      label: "string",
      disabled: "boolean | undefined",
    },
    innerHTML: ["option"],
    cssPseudoClass: [":disabled"],
  },
  option: {
    attributes: {
      value: "string | undefined",
      label: "string | undefined",
      disabled: "boolean | undefined",
      selected: "boolean | undefined",
    },
    innerHTML: ["#text"],
    cssPseudoClass: [":disabled", ":checked", ":default"],
  },
  output: {
    attributes: {
      for: "string | undefined",
      form: "string | undefined",
      name: "string | undefined",
    },
    innerHTML: ["#text", "span"],
  },
  progress: {
    attributes: {
      value: "number | undefined",
      max: "number | undefined",
    },
    innerHTML: ["#text"],
    cssPseudoClass: [":indeterminate"],
  },
  select: {
    attributes: {
      name: "string | undefined",
      disabled: "boolean | undefined",
      required: "boolean | undefined",
      multiple: "boolean | undefined",
      size: "number | undefined",
      form: "string | undefined",
      autocomplete: "string | undefined",
      autofocus: "boolean | undefined",
    },
    innerHTML: ["option", "optgroup"],
    cssPseudoClass: [
      ":disabled",
      ":enabled",
      ":valid",
      ":invalid",
      ":required",
      ":optional",
    ],
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
      minlength: "number | undefined",
      autofocus: "boolean | undefined",
      autocomplete: "string | undefined",
      form: "string | undefined",
      dirname: "string | undefined",
      wrap: "'hard' | 'soft' | undefined",
      spellcheck: "boolean | 'default' | undefined",
    },
    innerHTML: ["#text"],
    cssPseudoClass: [
      ":disabled",
      ":enabled",
      ":valid",
      ":invalid",
      ":required",
      ":optional",
      ":placeholder-shown",
      ":user-invalid",
    ],
  },

  // ─── Tables ─────────────────────────────────────────────────────────
  caption: {
    innerHTML: "*",
  },
  col: {
    attributes: {
      span: "number | undefined",
    },
    innerHTML: [],
  },
  colgroup: {
    attributes: {
      span: "number | undefined",
    },
    innerHTML: ["col"],
  },
  table: {
    innerHTML: ["caption", "colgroup", "thead", "tbody", "tfoot", "tr"],
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
  tfoot: {
    innerHTML: ["tr"],
  },
  th: {
    attributes: {
      colspan: "number | undefined",
      rowspan: "number | undefined",
      headers: "string | undefined",
      scope: "'row' | 'col' | 'rowgroup' | 'colgroup' | undefined",
      abbr: "string | undefined",
    },
    innerHTML: "*",
  },
  thead: {
    innerHTML: ["tr"],
  },
  tr: {
    innerHTML: ["th", "td"],
  },

  // ─── Interactive & Scripting ────────────────────────────────────────
  del: {
    attributes: {
      cite: "string | undefined",
      datetime: "string | undefined",
    },
    innerHTML: "*",
  },
  ins: {
    attributes: {
      cite: "string | undefined",
      datetime: "string | undefined",
    },
    innerHTML: "*",
  },
  pre: {
    innerHTML: ["#text", "code", "samp", "kbd"],
  },
  slot: {
    attributes: {
      name: "string | undefined",
    },
    innerHTML: "*",
    cssPseudoClass: [":slotted()"],
  },
  template: {
    innerHTML: "*",
  },
});
