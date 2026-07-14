# css-ts-syntax
This is a library meant to take a syntax as input and output whether a value adheres to that syntax.

## DSLString pipe (`|`) behavior

The `|` character in a DSL string is treated as a **union separator** between two DSL types. For example, `"string | number"` means "either a string or a number".

### Pipe inside quoted strings is unsupported

A literal pipe character inside a **single-quoted or double-quoted** string like `"'|'"` is **not supported**. The type-level parser splits on `|` before checking quote boundaries, so `"'|'"` is interpreted incorrectly as a union of `'` and `'` instead of the literal string `|`.

This is an intentional design trade-off: correctly tracking quote context at the type level to disambiguate `|` as a separator vs. literal character would add significant complexity to `DSLValidate` with negligible practical benefit, since literal pipe characters inside string values are vanishingly rare.

### Template literals are the exception

Template literals (backtick strings) **do** support `|` inside `${...}` interpolation syntax and are the correct way to express a value that contains a pipe:

```ts
`${"a" | "b"}` // valid — pipe inside ${} is a DSL-level union
```

Template literals are handled by `DSLTemplateDelimiter` before the general pipe-splitting logic, so the `|` inside `${...}` is correctly parsed as a DSL union rather than a string literal.

### Nested template literals are unsupported

A nested template literal like `` `\`${number | string}\`` `` (a backtick-literal backtick containing an interpolation) is **not supported**. Parsing this correctly at the type level would require:
- Tracking escape depth across multiple quote contexts
- Distinguishing between DSL-delimiting backticks and escaped literal backticks
- Resolving ambiguity when a backtick could be either a closing delimiter or an escaped character

The complexity added to `DSLValidate` and `DSLInfer` for this edge case is substantial, with negligible practical benefit — values that contain literal backticks inside template-like strings are exceptionally rare in CSS or HTML attribute contexts.
