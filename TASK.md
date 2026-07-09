# Tasks

## DSL

- [x] **Primitives** - `string`, `number`, `bigint`, `boolean`, `undefined`
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Parse
  - [x] Test

- [x] **Literals** - `true`, `false`
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Parse
  - [x] Test

- [x] **Literal Numbers** - `0`, `1`, ...
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Parse
  - [x] Test

- [x] **Literal Strings** - `""`, `''`, ` `` `
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Parse
  - [x] Test

- [x] **Literal String with pipe** - `'|'`, `"|"`, `` `|` `` *(edge case)*
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Parse
  - [x] Test


- [x] **Union Type** - `|`
  - [x] With Primitives - `string | number | bigint | boolean | undefined`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] With Literal Values
    - [x] Boolean Literal
      - [x] Type Validation
      - [x] Type Inference
      - [x] Runtime Validation
      - [x] Parse
      - [x] Test
    - [x] Number Literal
      - [x] Type Validation
      - [x] Type Inference
      - [x] Runtime Validation
      - [x] Parse
      - [x] Test
    - [x] String Literal
      - [x] Type Validation
      - [x] Type Inference
      - [x] Runtime Validation
      - [x] Parse
      - [x] Test
  - [x] Complex union - `true | 0 | 'a' | \`b\` | undefined | "c"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test

- [x] **Template Literals** - `` `${ }` ``
  - [x] Primitives - `string`, `number`, `bigint`, `boolean`, `undefined`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Literals - `true`, `0`, `"foo"`, `'bar'`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Complex Multi - `` `before${'a' | 'b'}mid${1 | 2}end` ``
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [ ] Nested template literal - `` `\`${number | string}\`` `` *(edge case)*
    - [ ] Type Validation
    - [ ] Type Inference
    - [ ] Runtime Validation
    - [ ] Parse
    - [ ] Test

- [x] Recursive DSL - `<length>` as `${number}{'%' | 'px'}` 
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Parse
  - [x] Test

- [x] **Negative Cases**
  - [x] Fails on non-existing keyword `"xyz"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on partially parsable union `"'xyz' | xyz"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on empty string `""`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on trailing pipe `"string |"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on leading pipe `"| string"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on double pipe `"string || number"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on empty union parts `"string |  | number"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on just a pipe `"|"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on illegal characters `( ) [ ] { }`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on mismatched quotes `"'unclosed"`, `"unclosed'"`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on whitespace-only `"   "`
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on unknown keyword in template interpolation `` `/${${unknown}}/` `` *(runtime now rejects as well)*
    - [x] Type Validation
    - [x] Type Inference
    - [x] Runtime Validation
    - [x] Parse
    - [x] Test
  - [x] Fails on type mismatch in `parseValueAgainstDSL` - value doesn't match DSL
    - [x] `"string"` rejects non-strings (number, boolean, undefined)
    - [x] `"number"` rejects non-numbers (string, bigint)
    - [x] `"boolean"` rejects truthy/falsy non-booleans (1, "")
    - [x] `"undefined"` rejects null

---

## HTML Attributes

- [x] **`htmlAttributeConfig` builder** - validates attribute DSL strings at runtime
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **Edge Cases**
  - [x] Empty config `{}` accepted
  - [x] Typed `as const` vs mutable config
  - [x] Object reference identity preserved
  - [x] Invalid DSL string throws error

## HTML Tags

- [x] **`htmlTagConfig` builder** - validates tag definitions, cross-references, and attribute DSL
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **innerHTML cross-references**
  - [x] Validates referenced tags exist in config
  - [x] `#text` allowed for text-containing tags
  - [x] `*` wildcard allows any child tag
  - [x] Self-referencing tags (`div` containing `div`)
  - [x] Mixed `#text` + tag references
  - [x] Void elements (empty `innerHTML: []`)

- [x] **Tag-specific attributes**
  - [x] Attributes validated via DSL on each tag
  - [x] Literal union attributes (`dir: "'ltr' | 'rtl' | 'auto' | undefined"`)
  - [x] Per-tag attribute overrides

- [x] **Edge Cases**
  - [x] Empty tag config `{}` accepted
  - [x] Tags with template literal DSL attributes
  - [x] Object reference identity preserved

## CSS Syntax

- [x] **`cssSyntaxConfig` builder** - validates syntax token definitions with recursive keyword resolution
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **Recursive keyword resolution** - `<length>` defined as template literal, used in `<length-percentage>` as `"<length> | <percentage>"`
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Parse
  - [x] Test

- [x] **Edge Cases**
  - [x] Circular or self-referencing syntax tokens
  - [x] Unknown token reference raises error
  - [x] Mixed token + literal unions

## CSS Attributes

- [x] **`cssAttributeConfig` builder** - maps CSS property names to syntax tokens or literal DSL strings
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **Token resolution & type inference**
  - [x] Single token resolves to raw DSL string
  - [x] Quoted literals infer as quoted string types
  - [x] Mixed token + literal unions
  - [x] Multiple attributes infer as mapped object
  - [x] Unknown token is a type-level error

## CSS Properties

- [x] **`cssPropertiesConfig` builder** - validates CSS `@property` rule definitions (`syntax`, `inherits`, `initial-value`)
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **`syntax` field validation**
  - [x] Must reference valid CSS syntax tokens
  - [x] DSL string validated at runtime via `dslString()`
  - [x] Supports complex DSL unions

- [x] **`inherits` field**
  - [x] Boolean validation
  - [x] Default handling

- [x] **`initial-value` field**
  - [x] Validated against resolved syntax type (runtime)
  - [x] Validated against resolved syntax type (type-level)
  - [x] Required (must be defined, per spec unless `syntax: "*"`)
  - [x] Must match the `syntax` DSL at runtime

- [x] **Property name validation** - names must start with `--`
  - [x] Type-level error for invalid names
  - [x] Runtime check for `--` prefix

- [x] **Edge Cases**
  - [x] Empty config `{}`
  - [x] Multiple custom properties
  - [x] Property names with `_` prefix (`--_a`)

---

## Create Component

- [x] **`createComponent` function** - validates a component structure against all configs
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **Tag validation**
  - [x] Recognized tag from tag config passes
  - [x] Unknown tag is a type-level error
  - [x] Missing `tag` property is rejected

- [x] **Attribute validation**
  - [x] Global attributes merged with tag-specific attributes
  - [x] Attribute values type-checked against inferred DSL types
  - [x] Undocumented attributes are rejected
  - [x] Optional attributes (`| undefined`) accept omission

- [x] **innerHTML validation**
  - [x] Text nodes allowed only when the tag allows text (`*` or `#text` in innerHTML)
  - [x] Void elements (empty `innerHTML: []`) reject children
  - [x] Nested hierarchy validated recursively
  - [x] Mixed text + child components

- [x] **innerHTML structural inheritance** - the set of allowed child tags propagates down the tree, gated by whether a tag declares `#text`; compile and runtime must agree
  - [x] Type Validation
  - [x] Runtime Validation
  - [x] Test
  - [x] `#text`-bearing tag is *conjunctive*: its children are validated against `inheritedAllowed ∩ tag.innerHTML`, and it narrows the inherited set for everything nested below it
  - [x] Non-`#text` array tag is a *reset*: its direct children are validated against exactly `tag.innerHTML`, and it passes the inherited set through unchanged
  - [x] The inherited restriction re-emerges one level below a reset tag (`a > ul > li` validates `li`'s children against `a.innerHTML ∩ li.innerHTML`)
  - [x] `*` tag *inherits* the ancestral set: a root `*` accepts any tag, but a nested `*` is limited to the inherited set (e.g. `ul > li > div > <x>` restricts `<x>`)
  - [x] Intersection example: `a > h1 > span` limited to `a.innerHTML ∩ h1.innerHTML`; a tag allowed by `h1` alone (e.g. `b`) is rejected under `a`
  - [x] Structural example: `a > ul` accepts only `li`

- [x] **CSS validation**
  - [x] Property values validated against CSS syntax config via `DSLInfer`
  - [x] CSS custom properties (`--*`) resolved against CSS properties config
  - [x] Child CSS selectors (`> childName`) allow per-child CSS blocks
  - [x] Nested CSS selectors validated recursively

---

## Render Component

- [x] **`renderComponent` function** - converts a component structure to separate HTML and CSS strings
  - [x] Type Validation (via engine binding `ValidateComponentStructure`)
  - [x] Test

- [x] **HTML string output**
  - [x] Tag name rendered correctly
  - [x] Void elements (`br`, `hr`, `img`) self-close properly
  - [x] Non-void elements wrap children

- [x] **Attribute rendering**
  - [x] Attributes serialized to HTML attribute syntax
  - [x] Boolean attributes (`true` renders without value, `false` omits attribute)
  - [x] Undefined/optional attributes omitted
  - [ ] Global attributes applied to all components
  - [ ] Tag-specific attributes applied correctly

- [x] **Text & children rendering**
  - [x] Text nodes rendered as-is
  - [x] Child components rendered recursively
  - [x] Mixed text and component children in correct order
  - [ ] Void elements reject children (error or ignored)

- [x] **CSS string output**
  - [x] Styled components receive a `cid-<hash>` attribute; children receive a semantic `cid-<name>` attribute for targeting
  - [x] Inline `css` block properties collected as scoped CSS rules
  - [x] Child CSS selectors (`> childName`) applied to corresponding children
  - [x] Pseudo-class blocks included in scoped styles
  - [x] Pseudo-element blocks included in scoped styles
  - [ ] Variation CSS merged with inline CSS
  - [ ] Property values validated against CSS syntax at runtime
  - [x] CSS output separate from HTML string (user handles integration)

- [ ] **Edge Cases**
  - [x] Empty component (no children, no CSS)
  - [x] Deeply nested components
  - [x] Components with all optional attributes omitted
  - [ ] Components with variations applied

---

## Render CSS Properties Config using the @property rule

- [x] **`renderCSSPropertiesConfig` function** - converts custom properties object to CSS string
  - [x] Runtime Validation
  - [x] Test

- [x] **Custom property rendering**
  - [x] Properties with `--` prefix rendered correctly
  - [x] `initial-value` always rendered (required per spec)
  - [x] Properties output in correct CSS `@property` format

- [x] **Edge Cases**
  - [x] Empty custom properties object
  - [x] Multiple properties with mixed types
  - [x] Numeric string values

---

## Pseudo-Class Config Builder

- [x] **`cssPseudoClassConfig` builder** - validates a pseudo-class config array
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **Prefix validation**
  - [x] Accepts `:` prefixed strings
  - [x] Rejects names without `:` prefix
  - [x] Runtime throws for missing `:` prefix
  - [x] Returns config unchanged

- [x] **Edge Cases**
  - [x] Empty array `[]` accepted

## Tag Config Pseudo-Class Declaration

- [x] **Extend `BaseHTMLTagConfig` with optional `cssPseudoClass: string[]` field**
  - [x] Type Validation
  - [x] Type Inference
  - [x] Runtime Validation
  - [x] Test

- [x] **Declaration rules**
  - [x] Accepts tag with valid pseudo-class references
  - [x] Rejects pseudo-class name not starting with `:`
  - [x] Tag without `cssPseudoClass` key = no pseudo-class support
  - [x] Tag with `cssPseudoClass: []` = no pseudo-class support
  - [x] Runtime accepts empty pseudo-class list
  - [x] Runtime preserves object reference

- [x] **Edge Cases**
  - [x] Multiple tags with different pseudo-class lists

## Component CSS: Pseudo-Class Block Validation

- [x] **Extend `ValidateComponentCSSStructure` to validate pseudo-class blocks against tag's `cssPseudoClass`**
  - [x] Type Validation
  - [x] Type Inference
  - [x] Test

- [x] **Block rules**
  - [x] Pseudo-class with all its CSS properties passes
  - [x] Pseudo-class on tag that doesn't declare it is rejected
  - [x] Pseudo-class on tag with `cssPseudoClass: []` is rejected
  - [x] Pseudo-class on tag with no `cssPseudoClass` key is rejected
  - [x] Multiple pseudo-classes in same css block accepted
  - [x] Globally-configured pseudo-class accepted on any tag

- [x] **Nesting**
  - [x] Pseudo-class inside child selector (`> child: { ":hover": {...} }`)
  - [x] Child selector inside pseudo-class (`":hover": { "> child": {...} }`)
  - [x] Pseudo-class inside nested pseudo-class (`":hover": { ":focus": {...} }`)

---

## Tag Config Pseudo-Element Declaration

- [x] **Extend `BaseHTMLTagConfig` with optional `cssPseudoElement` field**
  - [x] Type Validation
  - [x] Type Inference
  - [ ] Runtime Validation
  - [ ] Test

- [x] **Declaration rules**
  - [x] Accepts `::` prefixed pseudo-element strings in tag config
  - [x] Rejects pseudo-element names not starting with `::`
  - [x] Tag with `cssPseudoElement: []` = no additional pseudo-element support

- [x] **Edge Cases**
  - [x] Multiple tags with different pseudo-element lists

## Component CSS: Pseudo-Element Block Validation

- [x] **Extend `ValidateComponentCSSStructure` to validate pseudo-element blocks against tag's `cssPseudoElement`**
  - [x] Type Validation
  - [x] Type Inference
  - [x] Test

- [x] **Block rules**
  - [x] Pseudo-element with all its CSS properties passes
  - [x] Pseudo-element on tag that doesn't declare it is rejected
  - [x] Pseudo-element on tag with `cssPseudoElement: []` is rejected
  - [x] Pseudo-element on tag with no `cssPseudoElement` key is rejected
  - [x] Multiple pseudo-elements in same css block accepted
  - [x] Pseudo-element nested inside another pseudo-element is rejected

- [x] **Nesting**
  - [x] Pseudo-element inside child selector (`> child: { "::placeholder": {...} }`)
  - [x] Child selector inside pseudo-element (`"::placeholder": { "> child": {...} }`)
  - [x] Pseudo-element inside pseudo-class (`":hover": { "::placeholder": {...} }`)
  - [x] Pseudo-class inside pseudo-element (`"::placeholder": { ":hover": {...} }`)

---

## Variation System (Tag-level)

- [ ] **Extend `BaseHTMLTagConfig` with optional `variations` field**
  - [ ] Type Validation
  - [ ] Type Inference
  - [ ] Runtime Validation
  - [ ] Test

- [ ] **Validation rules**
  - [ ] Each variation maps a name to a partial CSS block
  - [ ] Variation CSS validated against CSSAttributesConfig + CSSPropertiesConfig
  - [ ] Rejects variation with invalid DSL
  - [ ] Rejects variation with unknown CSS property
  - [ ] Rejects variation with `--` property not in CSSPropertiesConfig
  - [ ] Accepts tag with empty variations `{}`
  - [ ] Accepts tag without `variations` key
  - [ ] Runtime throws for invalid DSL in variation CSS
  - [ ] Runtime preserves object reference

- [ ] **Edge Cases**
  - [ ] Multiple tags with different variation sets

## Component Variation Selection

- [ ] **Component selects variation via `attributes.variant`**
  - [ ] Type Validation
  - [ ] Type Inference
  - [ ] Runtime Validation
  - [ ] Test

- [ ] **Selection rules**
  - [ ] Valid `variant` matching a variation passes
  - [ ] `variant` value not in variations is rejected
  - [ ] `variant` on tag with no variations is rejected
  - [ ] Component without `variant` on tag with variations accepted

- [ ] **Merge behavior**
  - [ ] Variation CSS merged with inline `css` (inline overrides)
  - [ ] Pseudo blocks in component css work after variant merge
  - [ ] Pseudo block can override variation's CSS properties
