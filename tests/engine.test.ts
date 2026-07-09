import test, { describe } from "node:test";
import assert from "node:assert";
import engine from "@/engine/index.ts";
import { renderComponent } from "@/engine/render/render-component.ts";
import { cssPropertiesConfig } from "@/css/properties-config/index.ts";
import HTML_GLOBAL_ATTRIBUTES_CONFIG from "@/html/attribute-config/variations/common.ts";
import HTML_TAGS_CONFIG from "@/html/tag-config/variations/common.ts";
import CSS_SYNTAX_CONFIG from "@/css/syntax-config/variations/common.ts";
import CSS_ATTRIBUTES_CONFIG from "@/css/attribute-config/variations/common.ts";
import CSS_GLOBAL_PSEUDO_CLASSES_CONFIG from "@/css/pseudo-class-config/variations/common.ts";
import { SUPPORTED_KEYWORDS } from "@/dsl/index.ts";

const CSS_GLOBAL_PROPERTIES = cssPropertiesConfig(
  SUPPORTED_KEYWORDS,
  CSS_SYNTAX_CONFIG,
  {
    "--_a": {
      syntax: "<percentage>",
      inherits: false,
      "initial-value": "1%",
    },
  },
);

const {
  createComponent,
  renderComponent: renderBound,
  cssProperties,
} = engine({
  supportedKeywords: SUPPORTED_KEYWORDS,
  htmlAttributesConfig: HTML_GLOBAL_ATTRIBUTES_CONFIG,
  htmlTagConfig: HTML_TAGS_CONFIG,
  cssSyntaxConfig: CSS_SYNTAX_CONFIG,
  cssAttributesConfig: CSS_ATTRIBUTES_CONFIG,
  cssPseudoClassConfig: CSS_GLOBAL_PSEUDO_CLASSES_CONFIG,
  cssPropertiesConfig: CSS_GLOBAL_PROPERTIES,
});

describe("engine", () => {
  test("renderComponent is bound to the engine config", () => {
    const component = createComponent({
      tag: "div",
      innerHTML: { title: { tag: "h1", innerHTML: "hello" } },
      css: { width: "100%" },
    });

    // Bound call (node only) must equal the unbound call with explicit config.
    const bound = renderBound(component);
    const direct = renderComponent(HTML_TAGS_CONFIG, component);
    assert.deepStrictEqual(bound, direct);

    assert.match(bound.html, /^<div cid-[a-z0-9]+>/);
    assert.ok(bound.html.includes("<h1 cid-"));
    assert.ok(bound.html.includes("hello"));
    assert.ok(bound.css.includes("width: 100%;"));
  });

  test("void elements from the real config self-close", () => {
    const component = createComponent({
      tag: "img",
      attributes: { src: "a.png", alt: "" },
    });
    const { html } = renderBound(component);
    // A root void element with no css and no semantic name gets no identifier.
    assert.strictEqual(html, `<img src="a.png" alt="">`);
    assert.ok(!html.includes("</img>"));
  });

  test("cssProperties renders the @property config", () => {
    assert.ok(cssProperties.includes("@property --_a"));
  });
});
