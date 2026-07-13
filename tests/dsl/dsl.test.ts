import test, { describe } from "node:test";
import {
  dslString,
  parseValueAgainstDSL,
  SUPPORTED_KEYWORDS,
  type DSLInfer,
  type SupportedKeywords,
} from "@/dsl/index.ts";
import { assertType, type Equal } from "../type-utils.ts";
import assert from "node:assert";

describe("Primitive types", () => {
  describe("string", () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, "string">, string>>();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "string");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string", ""),
        "",
      );
    });
  });

  describe("number", () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, "number">, number>>();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "number");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "number", 0),
        0,
      );
    });
  });

  describe("bigint", () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, "bigint">, bigint>>();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "bigint");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "bigint", BigInt("1")),
        BigInt("1"),
      );
    });
  });

  describe("boolean", () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, "boolean">, boolean>>();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "boolean");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "boolean", true),
        true,
      );
      assert.strictEqual(
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "boolean", false),
        false,
      );
    });
  });

  describe("undefined", () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, "undefined">, undefined>>();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "undefined");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "undefined", undefined),
        undefined,
      );
    });
  });

  test("returns the same reference for objects-free primitives", () => {
    assert.strictEqual(
      parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string", "hello"),
      "hello",
    );
    assert.strictEqual(
      parseValueAgainstDSL(SUPPORTED_KEYWORDS, "number", 42),
      42,
    );
    assert.strictEqual(
      parseValueAgainstDSL(SUPPORTED_KEYWORDS, "bigint", 7n),
      7n,
    );
  });
});

describe("Literals", () => {
  describe("Literal Boolean", () => {
    describe("true", () => {
      test("Type Inference", () => {
        assertType<Equal<DSLInfer<SupportedKeywords, "true">, true>>();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "true");
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "true", true),
          true,
        );
      });
    });

    describe("false", () => {
      test("Type Inference", () => {
        assertType<Equal<DSLInfer<SupportedKeywords, "false">, false>>();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "false");
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "false", false),
          false,
        );
      });
    });
  });

  describe("Literal Number", () => {
    describe("0, 1", () => {
      test("Type Inference", () => {
        assertType<Equal<DSLInfer<SupportedKeywords, "0">, 0>>();
        assertType<Equal<DSLInfer<SupportedKeywords, "1">, 1>>();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "0");
        dslString(SUPPORTED_KEYWORDS, "1");
      });
      test("Parse", () => {
        assert.strictEqual(parseValueAgainstDSL(SUPPORTED_KEYWORDS, "0", 0), 0);
        assert.strictEqual(parseValueAgainstDSL(SUPPORTED_KEYWORDS, "1", 1), 1);
      });
    });
  });

  describe("Literal Strings", () => {
    describe("Single Quote ('')", () => {
      test("Type Inference", () => {
        assertType<Equal<DSLInfer<SupportedKeywords, "''">, "">>();
        assertType<Equal<DSLInfer<SupportedKeywords, "'a'">, "a">>();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "''");
        dslString(SUPPORTED_KEYWORDS, "'a'");
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "''", ""),
          "",
        );
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "'a'", "a"),
          "a",
        );
      });
    });

    describe('Double Quote ("")', () => {
      test("Type Inference", () => {
        assertType<Equal<DSLInfer<SupportedKeywords, '""'>, "">>();
        assertType<Equal<DSLInfer<SupportedKeywords, '"a"'>, "a">>();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, '""');
        dslString(SUPPORTED_KEYWORDS, '"a"');
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, '""', ""),
          "",
        );
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, '"a"', "a"),
          "a",
        );
      });
    });

    describe("Template Literal (``)", () => {
      test("Type Inference", () => {
        assertType<Equal<DSLInfer<SupportedKeywords, "``">, ``>>();
        assertType<Equal<DSLInfer<SupportedKeywords, "`a`">, "a">>();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "``");
        dslString(SUPPORTED_KEYWORDS, "`a`");
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "``", ``),
          ``,
        );
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "`a`", "a"),
          "a",
        );
      });
    });
  });
});

describe("Literal String with pipe - '|' \"|\" `|` [EDGE CASE]", () => {
  describe("Single Quote ('|')", () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, "'|'">, never>>();
    });
    test("Runtime Validation", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "'|'"),
      );
    });
    test("Parse", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "'|'", "|"),
      );
    });
  });

  describe('Double Quote ("|")', () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, '"|"'>, never>>();
    });
    test("Runtime Validation", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, '"|"'),
      );
    });
    test("Parse", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, '"|"', "|"),
      );
    });
  });

  describe("Template Literal (`|`)", () => {
    test("Type Inference", () => {
      assertType<Equal<DSLInfer<SupportedKeywords, "`|`">, `|`>>();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "`|`");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "`|`", `|`),
        `|`,
      );
    });
  });
});

describe("Union Type (|)", () => {
  describe("Union Type with Primitives - string | number | bigint | boolean | undefined", () => {
    test("Type Inference", () => {
      assertType<
        Equal<
          DSLInfer<
            SupportedKeywords,
            "string | number | bigint | boolean | undefined"
          >,
          string | number | bigint | boolean | undefined
        >
      >();
    });
    test("Runtime Validation", () => {
      dslString(
        SUPPORTED_KEYWORDS,
        "string | number | bigint | boolean | undefined",
      );
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "string | number | bigint | boolean | undefined",
          "",
        ),
        "",
      );

      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "string | number | bigint | boolean | undefined",
          0,
        ),
        0,
      );

      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "string | number | bigint | boolean | undefined",
          BigInt("0"),
        ),
        BigInt("0"),
      );

      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "string | number | bigint | boolean | undefined",
          true,
        ),
        true,
      );

      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "string | number | bigint | boolean | undefined",
          undefined,
        ),
        undefined,
      );
    });
  });

  describe("Union Type with Literal Value", () => {
    describe("Boolean Literal", () => {
      test("Type Inference", () => {
        assertType<
          Equal<DSLInfer<SupportedKeywords, "true | false">, true | false>
        >();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "true | false");
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "true | false", true),
          true,
        );
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "true | false", false),
          false,
        );
      });
    });

    describe("Number Literal", () => {
      test("Type Inference", () => {
        assertType<Equal<DSLInfer<SupportedKeywords, "0 | 1">, 0 | 1>>();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "0 | 1");
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "0 | 1", 0),
          0,
        );
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "0 | 1", 1),
          1,
        );
      });
    });

    describe("String Literal", () => {
      test("Type Inference", () => {
        assertType<
          Equal<DSLInfer<SupportedKeywords, "'foo' | 'bar'">, "foo" | "bar">
        >();
      });
      test("Runtime Validation", () => {
        dslString(SUPPORTED_KEYWORDS, "'foo' | 'bar'");
      });
      test("Parse", () => {
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "'foo' | 'bar'", "bar"),
          "bar",
        );
        assert.strictEqual(
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "'foo' | 'bar'", "bar"),
          "bar",
        );
      });
    });
  });

  describe("Complex union - true | 0 | 'a' | `b` | undefined | \"c\"", () => {
    test("Type Inference", () => {
      assertType<
        Equal<
          DSLInfer<
            SupportedKeywords,
            "true | 0 | 'a' | `b` | undefined | \"c\""
          >,
          true | 0 | "a" | `b` | undefined | "c"
        >
      >();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "true | 0 | 'a' | `b` | undefined | \"c\"");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "true | 0 | 'a' | `b` | undefined | \"c\"",
          true,
        ),
        true,
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "true | 0 | 'a' | `b` | undefined | \"c\"",
          0,
        ),
        0,
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "true | 0 | 'a' | `b` | undefined | \"c\"",
          "a",
        ),
        "a",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "true | 0 | 'a' | `b` | undefined | \"c\"",
          "b",
        ),
        "b",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "true | 0 | 'a' | `b` | undefined | \"c\"",
          undefined,
        ),
        undefined,
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "true | 0 | 'a' | `b` | undefined | \"c\"",
          "c",
        ),
        "c",
      );
    });
  });
});

describe("Template literal with pipe - `${ }`", () => {
  describe("Primitive types", () => {
    test("Type Inference", () => {
      assertType<
        Equal<
          DSLInfer<
            SupportedKeywords,
            "`${string | number | bigint | boolean | undefined}`"
          >,
          `${string | number | bigint | boolean | undefined}`
        >
      >();
    });
    test("Runtime Validation", () => {
      dslString(
        SUPPORTED_KEYWORDS,
        "`${string | number | bigint | boolean | undefined}`",
      );
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${string | number | bigint | boolean | undefined}`",
          "",
        ),
        "",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${string | number | bigint | boolean | undefined}`",
          "1.1",
        ),
        "1.1",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${string | number | bigint | boolean | undefined}`",
          "1",
        ),
        "1",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${string | number | bigint | boolean | undefined}`",
          "true",
        ),
        "true",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${string | number | bigint | boolean | undefined}`",
          "undefined",
        ),
        "undefined",
      );
    });
  });

  describe(`Literals - true, 0, "foo", 'bar'`, () => {
    test("Type Inference", () => {
      assertType<
        Equal<
          DSLInfer<SupportedKeywords, "`${true | 0 | \"foo\" | 'bar'}`">,
          `${true | 0 | "foo" | "bar"}`
        >
      >();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, "`${true | 0 | \"foo\" | 'bar'}`");
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${true | 0 | \"foo\" | 'bar'}`",
          "true",
        ),
        "true",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${true | 0 | \"foo\" | 'bar'}`",
          "0",
        ),
        "0",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${true | 0 | \"foo\" | 'bar'}`",
          "foo",
        ),
        "foo",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          "`${true | 0 | \"foo\" | 'bar'}`",
          "bar",
        ),
        "bar",
      );
    });
  });

  describe("Complex Multi `before${'a' | 'b'}mid${1 | 2}end`", () => {
    test("Type Inference", () => {
      assertType<
        Equal<
          DSLInfer<SupportedKeywords, '`before${"a" | "b"}mid${1 | 2}end`'>,
          `before${"a" | "b"}mid${1 | 2}end`
        >
      >();
    });
    test("Runtime Validation", () => {
      dslString(SUPPORTED_KEYWORDS, '`before${"a" | "b"}mid${1 | 2}end`');
    });
    test("Parse", () => {
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          '`before${"a" | "b"}mid${1 | 2}end`',
          "beforeamid1end",
        ),
        "beforeamid1end",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          '`before${"a" | "b"}mid${1 | 2}end`',
          "beforebmid1end",
        ),
        "beforebmid1end",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          '`before${"a" | "b"}mid${1 | 2}end`',
          "beforeamid2end",
        ),
        "beforeamid2end",
      );
      assert.strictEqual(
        parseValueAgainstDSL(
          SUPPORTED_KEYWORDS,
          '`before${"a" | "b"}mid${1 | 2}end`',
          "beforebmid2end",
        ),
        "beforebmid2end",
      );
    });
  });
});

describe("Recursive DSL - '<length>' as `${number}${'%' | 'px'}` ", () => {
  test("Type Inference", () => {
    assertType<
      Equal<
        DSLInfer<
          SupportedKeywords & { "<length>": "`${number}${'%' | 'px'}`" },
          "<length>"
        >,
        `${number}%` | `${number}px`
      >
    >();
  });
  test("Runtime Validation", () => {
    dslString(
      Object.assign({}, SUPPORTED_KEYWORDS, {
        "<length>": "`${number}${'%' | 'px'}`",
      }),
      "<length>",
    );
  });
  test("Parse", () => {
    assert.strictEqual(
      parseValueAgainstDSL(
        Object.assign({}, SUPPORTED_KEYWORDS, {
          "<length>": "`${number}${'%' | 'px'}`",
        }),
        "<length>",
        "1%",
      ),
      "1%",
    );
  });
});

describe("Error handling", () => {
  describe("type mismatches", () => {
    test("'string' throws for non-strings", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string", 0),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string", true),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string", undefined),
      );
    });

    test("'number' throws for non-numbers", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "number", "0"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "number", BigInt("0")),
      );
    });

    test("'undefined' throws for null", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "undefined", null),
      );
    });

    test("'boolean' throws for truthy/falsy non-booleans", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "boolean", 1),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "boolean", ""),
      );
    });
  });

  describe("literal/template value mismatches", () => {
    test("string-literal union throws for a non-member value", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "'foo' | 'bar'", "baz"),
      );
    });

    test("double-quoted literal throws for a non-member value", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, '"foo"', "baz"),
      );
    });

    test("template literal throws for a non-matching value", () => {
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "`a`", "zzz"),
      );
    });
  });

  describe("malformed DSL", () => {
    test("unknown primitive throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "xyz"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "xyz", "hi"),
      );
    });

    test("partially-valid union throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "string | xyz"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string | xyz", "hi"),
      );
    });

    test("empty string throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, ""),
      );
      // @ts-expect-error
      assert.throws(() => parseValueAgainstDSL(SUPPORTED_KEYWORDS, "", "hi"));
    });

    test("partially-parsable union with quoted literal throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "'xyz' | xyz"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "'xyz' | xyz", "xyz"),
      );
    });

    test("trailing pipe throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "string |"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string |", ""),
      );
    });

    test("leading pipe throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "| string"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "| string", ""),
      );
    });

    test("double pipe throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "string || number"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string || number", ""),
      );
    });

    test("empty union parts throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "string |  | number"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string |  | number", ""),
      );
    });

    test("just a pipe throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "|"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "|", ""),
      );
    });

    test("illegal characters throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "(string)"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "(string)", ""),
      );
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "[string]"),
      );
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "{string}"),
      );
    });

    test("mismatched quotes throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "'unclosed"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "'unclosed", ""),
      );
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "unclosed'"),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "unclosed'", ""),
      );
    });

    test("whitespace-only throws", () => {
      assert.throws(() =>
        // @ts-expect-error
        dslString(SUPPORTED_KEYWORDS, "   "),
      );
      assert.throws(() =>
        // @ts-expect-error
        parseValueAgainstDSL(SUPPORTED_KEYWORDS, "   ", "" as never),
      );
    });

    describe("unknown keyword in template interpolation", () => {
      test("Runtime Validation", () => {
        assert.throws(() => dslString(SUPPORTED_KEYWORDS, "`/${${unknown}}/`"));
      });
      test("Parse", () => {
        assert.throws(() =>
          // @ts-expect-error — unknown keyword can't be inferred, produces never
          parseValueAgainstDSL(SUPPORTED_KEYWORDS, "`/${${unknown}}/`", ""),
        );
      });
    });
  });

  describe("error messages", () => {
    test("malformed DSL error mentions the DSL string", () => {
      assert.throws(
        // @ts-expect-error
        () => parseValueAgainstDSL(SUPPORTED_KEYWORDS, "xyz", "hi"),
        /Invalid DSL string/,
      );
    });

    test("value mismatch error mentions the mismatch", () => {
      assert.throws(
        // @ts-expect-error
        () => parseValueAgainstDSL(SUPPORTED_KEYWORDS, "string", 5),
        /does not match DSL/,
      );
    });
  });
});
