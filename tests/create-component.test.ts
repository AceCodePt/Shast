import { test, describe } from "node:test";
import assert from "node:assert";
import { cssSyntaxConfig } from "@/css/syntax-config/index.ts";
import { cssAttributeConfig } from "@/css/attribute-config/index.ts";
import { cssPropertiesConfig } from "@/css/properties-config/index.ts";
import { createComponent } from "@/engine/create-component.ts";
import { htmlAttributeConfig } from "@/html/attribute-config/index.ts";
import { htmlTagConfig } from "@/html/tag-config/index.ts";
import { SUPPORTED_KEYWORDS } from "@/dsl/index.ts";

const EMPTY_PSEUDO_CLASSES = [] as const;

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
    innerHTML: ["#text", "div"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
});

const MOCK_INHERIT_CONFIG = htmlTagConfig(SUPPORTED_KEYWORDS, {
  a: {
    attributes: {},
    innerHTML: ["#text", "h1", "span", "ul", "div"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  h1: {
    attributes: {},
    innerHTML: ["#text", "span", "b"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  span: {
    attributes: {},
    innerHTML: ["#text", "b"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  b: {
    attributes: {},
    innerHTML: ["#text"],
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
    innerHTML: ["#text", "div", "span", "b"],
    cssPseudoClass: [],
    cssPseudoElement: [],
  },
  div: {
    attributes: {},
    innerHTML: "*",
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
    test("accepts valid explicit tag attributes and optional global attributes", () => {
      const config = createComponent(
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
      assert.deepStrictEqual(config, {
        tag: "img",
        attributes: {
          src: "logo.jpg",
          alt: "My Logo",
          id: "main-logo",
        },
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
    test("accepts void elements when innerHTML is absent", () => {
      const config = createComponent(
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
      assert.deepStrictEqual(config, {
        tag: "img",
        attributes: {
          src: "pic.png",
          alt: "Image text",
        },
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
    test("accepts string content when the element accepts text nodes", () => {
      const config = createComponent(
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
      assert.deepStrictEqual(config, {
        tag: "p",
        innerHTML: "Clean inline content",
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
    test("accepts valid nested configurations matching allowed child arrays", () => {
      const config = createComponent(
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
      assert.deepStrictEqual(config, {
        tag: "ul",
        innerHTML: {
          child1: {
            tag: "li",
            innerHTML: "text",
          },
        },
      });
    });

    test("rejects a direct child whose tag is not in the parent's innerHTML whitelist", () => {
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
                  // @ts-expect-error
                  tag: "p",
                  innerHTML: "Bad nested block",
                },
              },
            },
          ),
        /Structural Error: '<p>' is not a permitted child of <ul>/,
      );
    });

    test("gates a grandchild by its immediate parent, not the outer ancestor", () => {
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
                      // @ts-expect-error
                      tag: "p",
                    },
                  },
                },
              },
            },
          ),
        /Structural Error: '<p>' is not a permitted child of <li>/,
      );
    });
  });

  describe("innerHTML Structural Inheritance", () => {
    test("conjunctive intersection: a > h1 > span is accepted", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        MOCK_INHERIT_CONFIG,
        MOCK_CSS_SYNTAX,
        MOCK_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        MOCK_CSS_PROPERTIES,
        {
          tag: "a",
          innerHTML: {
            heading: {
              tag: "h1",
              innerHTML: {
                label: {
                  tag: "span",
                  innerHTML: "hi",
                },
              },
            },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "a",
        innerHTML: {
          heading: {
            tag: "h1",
            innerHTML: {
              label: {
                tag: "span",
                innerHTML: "hi",
              },
            },
          },
        },
      });
    });

    test("conjunctive intersection rejects a tag the outer ancestor forbids: a > h1 > b", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_INHERIT_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "a",
              innerHTML: {
                heading: {
                  tag: "h1",
                  innerHTML: {
                    label: {
                      // @ts-expect-error
                      tag: "b",
                    },
                  },
                },
              },
            },
          ),
        /Structural Error/,
      );
    });

    test("nested `*` accepts a tag in the inherited ancestral set: a > div > span", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        MOCK_INHERIT_CONFIG,
        MOCK_CSS_SYNTAX,
        MOCK_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        MOCK_CSS_PROPERTIES,
        {
          tag: "a",
          innerHTML: {
            wrapper: {
              tag: "div",
              innerHTML: {
                label: {
                  tag: "span",
                  innerHTML: "hi",
                },
              },
            },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "a",
        innerHTML: {
          wrapper: {
            tag: "div",
            innerHTML: {
              label: {
                tag: "span",
                innerHTML: "hi",
              },
            },
          },
        },
      });
    });

    test("nested `*` is restricted to the inherited set: a > div > b is rejected", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_INHERIT_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "a",
              innerHTML: {
                wrapper: {
                  tag: "div",
                  innerHTML: {
                    label: {
                      // @ts-expect-error
                      tag: "b",
                    },
                  },
                },
              },
            },
          ),
        /Structural Error/,
      );
    });

    test("reset structural tag: a > ul > li is accepted", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        MOCK_INHERIT_CONFIG,
        MOCK_CSS_SYNTAX,
        MOCK_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        MOCK_CSS_PROPERTIES,
        {
          tag: "a",
          innerHTML: {
            list: {
              tag: "ul",
              innerHTML: {
                item: {
                  tag: "li",
                  innerHTML: "hi",
                },
              },
            },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "a",
        innerHTML: {
          list: {
            tag: "ul",
            innerHTML: {
              item: {
                tag: "li",
                innerHTML: "hi",
              },
            },
          },
        },
      });
    });

    test("reset structural tag ignores the ancestral set: a > ul > span is rejected", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_INHERIT_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "a",
              innerHTML: {
                list: {
                  tag: "ul",
                  innerHTML: {
                    item: {
                      // @ts-expect-error
                      tag: "span",
                    },
                  },
                },
              },
            },
          ),
        /Structural Error/,
      );
    });

    test("ancestral set re-emerges below a reset tag: a > ul > li > div is accepted", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        MOCK_INHERIT_CONFIG,
        MOCK_CSS_SYNTAX,
        MOCK_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        MOCK_CSS_PROPERTIES,
        {
          tag: "a",
          innerHTML: {
            list: {
              tag: "ul",
              innerHTML: {
                item: {
                  tag: "li",
                  innerHTML: {
                    box: {
                      tag: "div",
                    },
                  },
                },
              },
            },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "a",
        innerHTML: {
          list: {
            tag: "ul",
            innerHTML: {
              item: {
                tag: "li",
                innerHTML: {
                  box: {
                    tag: "div",
                  },
                },
              },
            },
          },
        },
      });
    });

    test("re-emerged ancestral set rejects a tag only the immediate parent allows: a > ul > li > b", () => {
      assert.throws(
        () =>
          createComponent(
            SUPPORTED_KEYWORDS,
            MOCK_SHARED_ATTRIBUTES,
            MOCK_INHERIT_CONFIG,
            MOCK_CSS_SYNTAX,
            MOCK_CSS_ATTRIBUTES,
            EMPTY_PSEUDO_CLASSES,
            MOCK_CSS_PROPERTIES,
            {
              tag: "a",
              innerHTML: {
                list: {
                  tag: "ul",
                  innerHTML: {
                    item: {
                      tag: "li",
                      innerHTML: {
                        emphasis: {
                          // @ts-expect-error
                          tag: "b",
                        },
                      },
                    },
                  },
                },
              },
            },
          ),
        /Structural Error/,
      );
    });

    test("root `*` accepts any tag: div > b is accepted", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        MOCK_INHERIT_CONFIG,
        MOCK_CSS_SYNTAX,
        MOCK_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        MOCK_CSS_PROPERTIES,
        {
          tag: "div",
          innerHTML: {
            emphasis: {
              tag: "b",
              innerHTML: "hi",
            },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "div",
        innerHTML: {
          emphasis: {
            tag: "b",
            innerHTML: "hi",
          },
        },
      });
    });
  });

  describe("Component CSS: Pseudo-Class Block Validation", () => {
    const PSEUDO_CSS_ATTRIBUTES = cssAttributeConfig(
      SUPPORTED_KEYWORDS,
      MOCK_CSS_SYNTAX,
      {
        color: "string",
        display: "'block' | 'inline' | 'none'",
      },
    );
    const PSEUDO_CSS_PROPERTIES = cssPropertiesConfig(
      SUPPORTED_KEYWORDS,
      MOCK_CSS_SYNTAX,
      {},
    );
    const GLOBAL_PSEUDO = [":active"] as const;

    const PSEUDO_TAG_CONFIG = htmlTagConfig(SUPPORTED_KEYWORDS, {
      button: {
        attributes: {},
        innerHTML: ["#text"],
        cssPseudoClass: [":hover", ":focus"],
        cssPseudoElement: [],
      },
      span: {
        attributes: {},
        innerHTML: ["#text"],
        cssPseudoClass: [],
        cssPseudoElement: [],
      },
      div: {
        attributes: {},
        innerHTML: "*",
        cssPseudoClass: [],
        cssPseudoElement: [],
      },
    });

    test("accepts a declared pseudo-class block containing CSS properties", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "button",
          innerHTML: "Click",
          css: {
            color: "black",
            ":hover": { color: "red", display: "block" },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "button",
        innerHTML: "Click",
        css: {
          color: "black",
          ":hover": { color: "red", display: "block" },
        },
      });
    });

    test("accepts multiple declared pseudo-classes in the same css block", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "button",
          innerHTML: "Click",
          css: {
            ":hover": { color: "red" },
            ":focus": { color: "blue" },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "button",
        innerHTML: "Click",
        css: {
          ":hover": { color: "red" },
          ":focus": { color: "blue" },
        },
      });
    });

    test("accepts a globally-configured pseudo-class on any tag", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "span",
          innerHTML: "text",
          css: {
            ":active": { color: "red" },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "span",
        innerHTML: "text",
        css: {
          ":active": { color: "red" },
        },
      });
    });

    test("accepts a pseudo-class inside a child selector, scoped to the child's tag", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "div",
          innerHTML: { label: { tag: "button", innerHTML: "Hi" } },
          css: {
            "> label": { ":hover": { color: "red" } },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "div",
        innerHTML: { label: { tag: "button", innerHTML: "Hi" } },
        css: {
          "> label": { ":hover": { color: "red" } },
        },
      });
    });

    test("accepts a child selector inside a pseudo-class block", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "div",
          innerHTML: { label: { tag: "button", innerHTML: "Hi" } },
          css: {
            ":active": { "> label": { color: "red" } },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "div",
        innerHTML: { label: { tag: "button", innerHTML: "Hi" } },
        css: {
          ":active": { "> label": { color: "red" } },
        },
      });
    });

    test("accepts a pseudo-class nested inside another pseudo-class", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "button",
          innerHTML: "Click",
          css: {
            ":hover": { ":focus": { color: "red" } },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "button",
        innerHTML: "Click",
        css: {
          ":hover": { ":focus": { color: "red" } },
        },
      });
    });

    test("rejects a pseudo-class the tag does not declare and is not global", () => {
      createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "button",
          innerHTML: "Click",
          css: {
            // @ts-expect-error
            ":disabled": { color: "red" },
          },
        },
      );
    });

    test("rejects a pseudo-class on a tag with an empty cssPseudoClass list", () => {
      createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "span",
          innerHTML: "text",
          css: {
            // @ts-expect-error
            ":hover": { color: "red" },
          },
        },
      );
    });

    test("rejects a pseudo-class on a tag with no cssPseudoClass key", () => {
      const NO_PSEUDO_TAG_CONFIG = {
        widget: {
          attributes: {},
          innerHTML: ["#text"],
          cssPseudoElement: [],
        },
      };
      createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        // @ts-expect-error
        NO_PSEUDO_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PSEUDO_CSS_ATTRIBUTES,
        GLOBAL_PSEUDO,
        PSEUDO_CSS_PROPERTIES,
        {
          tag: "widget",
          innerHTML: "text",
          css: {
            ":hover": { color: "red" },
          },
        },
      );
    });
  });

  describe("Component CSS: Pseudo-Element Block Validation", () => {
    const PE_CSS_ATTRIBUTES = cssAttributeConfig(
      SUPPORTED_KEYWORDS,
      MOCK_CSS_SYNTAX,
      {
        color: "string",
        display: "'block' | 'inline' | 'none'",
      },
    );
    const PE_CSS_PROPERTIES = cssPropertiesConfig(
      SUPPORTED_KEYWORDS,
      MOCK_CSS_SYNTAX,
      {},
    );

    const PE_TAG_CONFIG = htmlTagConfig(SUPPORTED_KEYWORDS, {
      field: {
        attributes: {},
        innerHTML: ["#text"],
        cssPseudoClass: [":hover"],
        cssPseudoElement: ["::placeholder"],
      },
      box: {
        attributes: {},
        innerHTML: "*",
        cssPseudoClass: [],
        cssPseudoElement: ["::before", "::after"],
      },
      span: {
        attributes: {},
        innerHTML: ["#text"],
        cssPseudoClass: [],
        cssPseudoElement: [],
      },
    });

    test("accepts a declared pseudo-element block containing CSS properties", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "field",
          innerHTML: "x",
          css: {
            color: "black",
            "::placeholder": { color: "gray", display: "block" },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "field",
        innerHTML: "x",
        css: {
          color: "black",
          "::placeholder": { color: "gray", display: "block" },
        },
      });
    });

    test("accepts multiple declared pseudo-elements in the same css block", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "box",
          innerHTML: "x",
          css: {
            "::before": { color: "red" },
            "::after": { color: "blue" },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "box",
        innerHTML: "x",
        css: {
          "::before": { color: "red" },
          "::after": { color: "blue" },
        },
      });
    });

    test("accepts a pseudo-element inside a child selector, scoped to the child's tag", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "box",
          innerHTML: { fld: { tag: "field", innerHTML: "x" } },
          css: {
            "> fld": { "::placeholder": { color: "gray" } },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "box",
        innerHTML: { fld: { tag: "field", innerHTML: "x" } },
        css: {
          "> fld": { "::placeholder": { color: "gray" } },
        },
      });
    });

    test("accepts a child selector inside a pseudo-element block", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "box",
          innerHTML: { item: { tag: "span", innerHTML: "x" } },
          css: {
            "::before": { "> item": { color: "red" } },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "box",
        innerHTML: { item: { tag: "span", innerHTML: "x" } },
        css: {
          "::before": { "> item": { color: "red" } },
        },
      });
    });

    test("accepts a pseudo-element inside a pseudo-class block", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "field",
          innerHTML: "x",
          css: {
            ":hover": { "::placeholder": { color: "gray" } },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "field",
        innerHTML: "x",
        css: {
          ":hover": { "::placeholder": { color: "gray" } },
        },
      });
    });

    test("accepts a pseudo-class inside a pseudo-element block", () => {
      const config = createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "field",
          innerHTML: "x",
          css: {
            "::placeholder": { ":hover": { color: "gray" } },
          },
        },
      );
      assert.deepStrictEqual(config, {
        tag: "field",
        innerHTML: "x",
        css: {
          "::placeholder": { ":hover": { color: "gray" } },
        },
      });
    });

    test("rejects a pseudo-element the tag does not declare", () => {
      createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "field",
          innerHTML: "x",
          css: {
            // @ts-expect-error
            "::before": { color: "red" },
          },
        },
      );
    });

    test("rejects a pseudo-element on a tag with an empty cssPseudoElement list", () => {
      createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "span",
          innerHTML: "x",
          css: {
            // @ts-expect-error
            "::placeholder": { color: "red" },
          },
        },
      );
    });

    test("rejects a pseudo-element on a tag with no cssPseudoElement key", () => {
      const NO_PE_TAG_CONFIG = {
        plain: {
          attributes: {},
          innerHTML: ["#text"],
          cssPseudoClass: [],
        },
      };
      createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        // @ts-expect-error
        NO_PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "plain",
          innerHTML: "x",
          css: {
            "::placeholder": { color: "red" },
          },
        },
      );
    });

    test("rejects a pseudo-element nested inside another pseudo-element", () => {
      createComponent(
        SUPPORTED_KEYWORDS,
        MOCK_SHARED_ATTRIBUTES,
        PE_TAG_CONFIG,
        MOCK_CSS_SYNTAX,
        PE_CSS_ATTRIBUTES,
        EMPTY_PSEUDO_CLASSES,
        PE_CSS_PROPERTIES,
        {
          tag: "box",
          innerHTML: "x",
          css: {
            "::before": {
              // @ts-expect-error
              "::after": { color: "red" },
            },
          },
        },
      );
    });
  });
});
