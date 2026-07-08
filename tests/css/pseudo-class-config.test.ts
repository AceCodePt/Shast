import test, { describe } from "node:test";
import assert from "node:assert";
import { cssPseudoClassConfig } from "@/css/pseudo-class-config/index.ts";
import type { BaseCSSPseudoClassConfig } from "@/css/pseudo-class-config/types.ts";
import { assertType, type Equal } from "../type-utils.ts";

describe("cssPseudoClassConfig", () => {
  describe("Type Validation", () => {
    test("accepts `:` prefixed strings", () => {
      assertType<
        Equal<BaseCSSPseudoClassConfig, readonly `:${string}${string}`[]>
      >();
    });

    test("rejects names without `:` prefix", () => {
      assertType<
        Equal<
          [":hover", ":focus"] extends BaseCSSPseudoClassConfig ? true : false,
          true
        >
      >();
      assertType<
        Equal<
          ["hover"] extends readonly `:${string}${string}`[] ? true : false,
          false
        >
      >();
    });
  });

  describe("Runtime Validation", () => {
    test("throws for missing `:` prefix", () => {
      assert.throws(
        () => cssPseudoClassConfig(["hover"] as any),
        /Pseudo Class must start with :/,
      );
    });

    test("returns config unchanged", () => {
      const input = [":hover", ":active"] as const;
      const config = cssPseudoClassConfig(input);
      assert.deepStrictEqual(config, input);
    });

    test("preserves object reference", () => {
      const input = [":hover", ":active"] as const;
      const config = cssPseudoClassConfig(input);
      assert.strictEqual(config, input);
    });
  });

  describe("Edge Cases", () => {
    test("empty array `[]` accepted", () => {
      const config = cssPseudoClassConfig([]);
      assert.deepStrictEqual(config, []);
    });
  });
});
