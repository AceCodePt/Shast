import { htmlTagConfig } from "../index.ts";

export default htmlTagConfig({
  a: {
    attributes: {
      href: "string | undefined",
      target: "'_self' | '_blank' | '_parent' | '_top' | undefined",
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
  br: {
    innerHTML: [],
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
      hidden: "boolean | undefined",
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
    innerHTML: ["#text", "span", "a", "img", "input", "br", "label"],
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
