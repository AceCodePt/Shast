import test, { describe } from "node:test";
import assert from "node:assert";
import { renderCSSPropertiesConfig } from "@/render/properties-config.ts";

describe("renderCSSPropertiesConfig", () => {
  describe("Custom property rendering", () => {
    test("renders a single custom property with all fields", () => {
      const result = renderCSSPropertiesConfig({
        "--my-color": {
          syntax: "<color>",
          inherits: false,
          "initial-value": "#c0ffee",
        },
      });
      assert.strictEqual(
        result,
        [
          "@property --my-color {",
          '  syntax: "<color>";',
          "  inherits: false;",
          "  initial-value: #c0ffee;",
          "}",
        ].join("\n"),
      );
    });

    test("renders multiple custom properties separated by blank line", () => {
      const result = renderCSSPropertiesConfig({
        "--a": {
          syntax: "<percentage>",
          inherits: true,
          "initial-value": "1%",
        },
        "--b": {
          syntax: "<color>",
          inherits: false,
          "initial-value": "transparent",
        },
      });
      assert.strictEqual(
        result,
        [
          "@property --a {",
          '  syntax: "<percentage>";',
          "  inherits: true;",
          "  initial-value: 1%;",
          "}",
          "",
          "@property --b {",
          '  syntax: "<color>";',
          "  inherits: false;",
          "  initial-value: transparent;",
          "}",
        ].join("\n"),
      );
    });
  });

  describe("Error handling", () => {
    test("property name without -- prefix throws at runtime", () => {
      assert.throws(
        () =>
          renderCSSPropertiesConfig({
            // @ts-expect-error
            a: { syntax: "<number>", inherits: false, "initial-value": "1" },
          }),
        /must have the property start with --/,
      );
    });

    test("missing initial-value throws at runtime", () => {
      assert.throws(
        () =>
          renderCSSPropertiesConfig({
            "--spacing": { syntax: "<length>", inherits: true },
          }),
        /initial-value is required/,
      );
    });
  });

  describe("Edge Cases", () => {
    test("empty config returns empty string", () => {
      const result = renderCSSPropertiesConfig({});
      assert.strictEqual(result, "");
    });

    test("numeric string values are rendered correctly", () => {
      const result = renderCSSPropertiesConfig({
        "--opacity": {
          syntax: "<number>",
          inherits: false,
          "initial-value": "1",
        },
      });
      assert.strictEqual(
        result,
        [
          "@property --opacity {",
          '  syntax: "<number>";',
          "  inherits: false;",
          "  initial-value: 1;",
          "}",
        ].join("\n"),
      );
    });

    test("preserves the exact initial-value string as-is", () => {
      const result = renderCSSPropertiesConfig({
        "--size": {
          syntax: "<length>",
          inherits: true,
          "initial-value": "calc(100% - 2rem)",
        },
      });
      assert.strictEqual(
        result,
        [
          "@property --size {",
          '  syntax: "<length>";',
          "  inherits: true;",
          "  initial-value: calc(100% - 2rem);",
          "}",
        ].join("\n"),
      );
    });
  });
});
