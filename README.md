# css-ts-syntax

**Structurally typed HTML + CSS: styles cannot outlive the markup they target.**

The bug this library kills is not *writing* CSS — it's *refactoring* HTML.
You rename a wrapper, move a child, delete a node… and somewhere a selector
silently stops matching. Nothing fails. The dead CSS just stays there.

Here, a component's CSS is typed *against its own structure*. Change the
structure and every style rule that targeted the old structure becomes a
**compile error at that exact spot** — and, as a second wall, a **runtime
error** if the type layer was bypassed.

```ts
const { createComponent, renderComponent } = engine({
  supportedKeywords: SUPPORTED_KEYWORDS,
  htmlAttributesConfig: HTML_GLOBAL_ATTRIBUTES_CONFIG,
  htmlTagConfig: HTML_TAGS_CONFIG,
  cssSyntaxConfig: CSS_SYNTAX_CONFIG,
  cssAttributesConfig: CSS_ATTRIBUTES_CONFIG,
  cssPseudoClassConfig: CSS_GLOBAL_PSEUDO_CLASSES_CONFIG,
  cssPropertiesConfig: CSS_GLOBAL_PROPERTIES,
});

const card = createComponent({
  tag: "div",
  innerHTML: {
    title: { tag: "h1", innerHTML: "hello" },
  },
  css: {
    width: "100%",
    "> title": { color: "inherit" }, // typed as a key of innerHTML
  },
});

const { html, css } = renderComponent(card);
// html: <div cid-x1y2z3><h1 cid-title>hello</h1></div>
// css:  scoped rules for [cid-x1y2z3] and its > [cid-title]
```

Now rename `title` to `heading` and forget the CSS:

```ts
innerHTML: { heading: { tag: "h1", innerHTML: "hello" } },
css: { "> title": { ... } }
//     ^^^^^^^^^ error: '"> title"' does not exist in type
//     '{ readonly "> heading"?: ... }'
```

The stale style is not a visual bug you discover next month. It's a red
squiggle right now.

## What gets validated

Everything is defined in **closed-world config registries** — tags, allowed
children, attributes (as DSL strings), CSS properties, syntax tokens,
`@property` custom properties, pseudo-classes/elements — and every component
is checked against them **twice**:

| Rule | Compile time | Runtime |
|---|---|---|
| Tag exists in the registry | ✓ | ✓ |
| Child tag allowed by parent (`ul` → only `li`) | ✓ | ✓ |
| Ancestral inheritance (`a > h1 > b` rejected because `a ∩ h1` forbids `b`) | ✓ | ✓ |
| Attribute exists and value matches its DSL type | ✓ | ✓ |
| CSS property value matches the syntax config | ✓ | see [Limitations](#limitations) |
| `> child` selector targets a real named child (at any nesting depth) | ✓ | ✓ |
| `&.class` selector references a class declared on the context element | ✓ | ✓ |
| Custom property (`--x`) registered and value matches its `syntax` | ✓ | ✓ |
| Pseudo-class/element declared for that tag | ✓ | see [Limitations](#limitations) |

Composition does not weaken any of this: components built in separate files
and embedded into parents are **re-validated under the parent's context**, at
both levels. Widened types fail closed — they can't be embedded at all. See
[docs/structural-coupling.md](docs/structural-coupling.md) for the verified
guarantees and their test methodology.

## For AI agents and humans alike

The same design serves both audiences, deliberately:

- **Humans** get autocomplete driven by the registries (valid tags, valid
  children, valid CSS values for *this* property on *this* element) and
  refactoring that fails loudly instead of silently.
- **AI agents** get anti-hallucination walls. A model cannot invent a tag,
  attribute, design token, or custom property that isn't in the registry —
  `tsc` rejects it with a pointed message (`'colr' is not supported`,
  `'<p>' is not a permitted child of <ul>`), and the runtime backstop catches
  anything that slips past the types (`as any`, generated code). The
  component format is JSON-shaped, which models emit far more reliably than
  JSX, and a config-derived schema can constrain generation outright.

The wall is only as good as its error messages, so diagnostic quality is
treated as an interface, not an accident — error strings carry the path and
the expectation, and regressions in message clarity are considered bugs.

## Own your registry

The registries are meant to live **inside your codebase** and be tailored to
it — the same philosophy as shadcn: you don't install a black box, you own the
config and grow it as your project grows.

- **Start from `common` (or `minimal`)**, not `full`. Add a tag, an attribute,
  a syntax token *when you need it*, next to the code that needs it.
- **`full` is a reference, not a starting point.** It covers essentially the
  entire HTML/CSS surface, and it's extremely unlikely your project wants the
  entire web platform as its vocabulary. A registry that permits everything
  protects against nothing.
- **Smaller registries are strictly better** on every axis this library cares
  about: tighter anti-hallucination walls for AI (a model can't reach for a
  tag your design system doesn't use), sharper autocomplete for humans, and a
  smaller type-checking constant (registry breadth — not component count — is
  what drives editor latency).

Your registry *is* your design system's vocabulary. If `<table>` isn't in it,
nobody — human or model — ships a table.

## Performance (measured, not promised)

- `tsc` cost is **linear**: ~4.8K instantiations / ~5ms per component
  (400 components: 2.4s full check).
- Editor: warm completions inside a `css` block 8–18ms; ~43ms full-file
  recheck for a typical component file.

Keep files to a handful of components each and the type machinery is
imperceptible. Details in
[docs/structural-coupling.md](docs/structural-coupling.md).

## Limitations

Some limitations are **deliberate trade-offs** to keep the type system snappy;
others are **known gaps** with the fix tracked in `TASK.md`. They are listed
here rather than hidden in either category's fine print.

### Deliberate (kept for type-system performance)

Attribute and CSS value types are written as DSL strings
(`"'ltr' | 'rtl' | undefined"`, `` "`${number}px`" ``) that are parsed at the
type level *and* validated at runtime. Two parsing edge cases are intentionally
unsupported because handling them would slow every DSL string down for a
vanishingly rare case:

- **Pipe inside quoted strings.** The `|` character is a **union separator**.
  A literal pipe inside a single/double-quoted string (`"'|'"`) is not
  supported: the type-level parser splits on `|` before checking quote
  boundaries, and quote-aware splitting at the type level adds significant
  complexity. Template literals are the exception: `` `${"a" | "b"}` ``
  handles `|` inside `${...}` correctly, because backtick strings are parsed
  by `DSLTemplateDelimiter` before the pipe split.
- **Nested template literals.** `` `\`${number | string}\`` `` (a
  backtick-literal backtick containing an interpolation) is not supported —
  tracking escape depth across quote contexts at the type level costs far more
  than the edge case is worth.

### Known gaps (runtime wall only — the type wall covers these today)

- **CSS property *values* are not validated at runtime.** Selector structure
  in `css` blocks *is* runtime-validated (`> child` keys against `innerHTML`,
  `&.class` keys against the context element's `class` attribute, at any
  nesting depth), but an invalid property value (`color: "magenta"` when the
  syntax config says `'red' | 'blue'`) passes runtime validation if the type
  layer is bypassed (`as any`, generated code).
- **Pseudo-class/element usage** in css blocks and pseudo-element declarations
  in the tag config are type-checked but not runtime-checked.

Until these close, the runtime backstop covers *structure, attributes, and
selector shape* but not yet *style values* — worth knowing if you rely on the
runtime wall alone (e.g. validating untyped AI output without running `tsc`).
