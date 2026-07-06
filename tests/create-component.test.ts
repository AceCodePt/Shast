import { test, describe } from "node:test";
import assert from "node:assert";
import { cssSyntaxConfig } from "../src/css/syntax-config/index.ts";
import { cssAttributeConfig } from "../src/css/attribute-config/index.ts";
import { cssPropertiesConfig } from "../src/css/properties-config/index.ts";
import { createComponent } from "../src/create-component.ts";
import { htmlAttributeConfig } from "../src/html/attribute-config/index.ts";
import { htmlTagConfig } from "../src/html/tag-config/index.ts";
import { SUPPORTED_KEYWORDS } from "../src/dsl/index.ts";

const EMPTY_PSEUDO_CLASSES = [] as const;

// ==========================================
// 1. SETUP STATIC TEST SCHEMAS
// ==========================================
const MOCK_SHARED_ATTRIBUTES = htmlAttributeConfig(SUPPORTED_KEYWORDS, {
  id: "string | undefined",
  class: "string | undefined",
});

const MOCK_TAG_CONFIG = htmlTagConfig(SUPPORTED_KEYWORDS, {
  div: {
    attributes: {},
    innerHTML: "*",
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  p: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  img: {
    attributes: { src: "string", alt: "string" },
    innerHTML: [],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  ul: {
    attributes: {},
    innerHTML: ["li"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  li: {
    attributes: {},
    innerHTML: ["#text"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
});

const MOCK_CSS_SYNTAX = cssSyntaxConfig(SUPPORTED_KEYWORDS, {});
const MOCK_CSS_ATTRIBUTES = cssAttributeConfig(
  SUPPORTED_KEYWORDS,
  MOCK_CSS_SYNTAX,
  {},
);
const MOCK_CSS_PROPERTIES = cssPropertiesConfig(
  SUPPORTED_KEYWORDS,
  MOCK_CSS_SYNTAX,
  {},
);

// ==========================================
// 2. COMPONENT VALIDATION TEST SUITE
// ==========================================
describe("validateComponent & createComponent", () => {
  describe("Baseline Structural Checks", () => {
    test("should fail if node is null or not an object", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            //@ts-expect-error
            null,
          ),
        /Validation Error: Provided node is not a valid component object/,
      );
    });

    test("should fail if tag is missing or is not a string", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              // @ts-expect-error
              innerHTML: "text",
            },
          ),
        /Validation Error: Component node is missing a valid string 'tag' property/,
      );
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              // @ts-expect-error
              tag: 123,
            },
          ),
        /Validation Error: Component node is missing a valid string 'tag' property/,
      );
    });

    test("should fail if tag is not recognized in the registry", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              // @ts-expect-error
              tag: "section",
            },
          ),
        /Structural Error: '<section>' is not a recognized configuration tag in your registry/,
      );
    });
  });

  describe("Attribute Validation Firewall", () => {
    test("should pass valid explicit tag attributes and optional global attributes", () => {
      assert.doesNotThrow(() => {
        createComponent(
          SUPPORTED_KEYWORDS,
          MOCK_SHARED_ATTRIBUTES,
          MOCK_TAG_CONFIG,
          MOCK_CSS_SYNTAX,
          MOCK_CSS_ATTRIBUTES,
          EMPTY_PSEUDO_CLASSES,
          MOCK_CSS_PROPERTIES,
          {
            tag: "img",
            attributes: {
              src: "logo.jpg",
              alt: "My Logo",
              id: "main-logo",
            },
          },
        );
      });
    });

    test("should fail when encountering undocumented attributes", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "p",
              attributes: {
                //@ts-expect-error
                href: "https://google.com",
              },
            },
          ),
        /Attribute Error: Property 'href' is not a valid attribute for <p> or the Global configuration registry/,
      );
    });
  });

  describe("Void Element Controls", () => {
    test("should pass void elements when innerHTML is absent", () => {
      assert.doesNotThrow(() => {
        createComponent(
          SUPPORTED_KEYWORDS,
          MOCK_SHARED_ATTRIBUTES,
          MOCK_TAG_CONFIG,
          MOCK_CSS_SYNTAX,
          MOCK_CSS_ATTRIBUTES,
          EMPTY_PSEUDO_CLASSES,
          MOCK_CSS_PROPERTIES,
          {
            tag: "img",
            attributes: {
              src: "pic.png",
              alt: "Image text",
            },
          },
        );
      });
    });

    test("should fail void elements if string content is passed", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "img",
              attributes: {
                src: "pic.png",
                alt: "Image text",
              },
              //@ts-expect-error
              innerHTML: {
                text: "Illegal Text Inside Void Element",
              },
            },
          ),
        /Validation Error: Tag '<img>' is configured as a void element and must not contain any innerHTML or children/,
      );
    });
  });

  describe("Text Content Controls", () => {
    test("should fail element with string content if it accepts text nodes", () => {
      assert.throws(() => {
        createComponent(
          SUPPORTED_KEYWORDS,
          MOCK_SHARED_ATTRIBUTES,
          MOCK_TAG_CONFIG,
          MOCK_CSS_SYNTAX,
          MOCK_CSS_ATTRIBUTES,
          EMPTY_PSEUDO_CLASSES,
          MOCK_CSS_PROPERTIES,
          {
            tag: "p",
            innerHTML: "Clean inline content",
          },
        );
      });
    });

    test("should fail element with string content if it explicitly bars text nodes", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "ul",
              // @ts-expect-error
              innerHTML: { text: "Illegal Direct Text Node Element" },
            },
          ),
        /Validation Error: Tag '<ul>' innerHTML cannot contain a string without the #text/,
      );
    });
  });

  describe("Structural Hierarchy Arrays", () => {
    test("should pass valid nested configurations matching allowed child arrays", () => {
      assert.doesNotThrow(() => {
        createComponent(
          SUPPORTED_KEYWORDS,
          MOCK_SHARED_ATTRIBUTES,
          MOCK_TAG_CONFIG,
          MOCK_CSS_SYNTAX,
          MOCK_CSS_ATTRIBUTES,
          EMPTY_PSEUDO_CLASSES,
          MOCK_CSS_PROPERTIES,
          {
            tag: "ul",
            innerHTML: {
              child1: {
                tag: "li",
                innerHTML: "text",
              },
            },
          },
        );
      });
    });

    test("should catch illegal child elements placed inside structural limits", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "ul",
              innerHTML: {
                badChild: {
                  // @ts-ignore
                  tag: "p",
                  innerHTML: "Bad nested block",
                },
              },
            },
          ),
        /Structural Error: '<ul>' cannot contain a '<p>' element. Allowed elements: \[li\]/,
      );
    });

    test("should bubble up validation errors during recursive deep nested tree tracking", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_TAG_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "ul",
              innerHTML: {
                item: {
                  tag: "li",
                  innerHTML: {
                    invalidGrandchild: {
                      // @ts-ignore
                      tag: "div",
                    },
                  },
                },
              },
            },
          ),
        /Structural Error: '<li>' cannot contain a '<div>' element. Allowed elements: \[#text\]/,
      );
    });
  });
});
