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
});
