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
  - [x] Fails on unknown keyword in template interpolation `` `/${${unknown}}/` `` *(type-level only, runtime treats as quoted string)*
    - [x] Type Validation
    - [x] Type Inference
    - [ ] Runtime Validation
    - [ ] Parse
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
  - [ ] Circular or self-referencing syntax tokens
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
  - [x] Validated against resolved syntax type
  - [x] Optional (may be omitted)
  - [x] Must match the `syntax` DSL at the type level

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
  - [x] Text nodes allowed only when `#text` is in tag's innerHTML
  - [x] Child components must have tags listed in parent's innerHTML
  - [x] `*` wildcard allows any child tag
  - [x] Void elements (empty `innerHTML: []`) reject children
  - [x] Nested hierarchy validated recursively
  - [x] Mixed text + child components

- [x] **CSS validation**
  - [x] Property values validated against CSS syntax config via `DSLInfer`
  - [x] CSS custom properties (`--*`) resolved against CSS properties config
  - [x] Child CSS selectors (`> childName`) allow per-child CSS blocks
  - [x] Nested CSS selectors validated recursively

---

### Pseudo-Class Config Builder

- [x] **`cssPseudoClassConfig` function** - validates a pseudo-class config array
  - [x] Type validation - accepts `:` prefixed strings
  - [x] Type validation - rejects names without `:` prefix
  - [x] Runtime validation - throws for missing `:` prefix
  - [x] Runtime validation - returns config unchanged
  - [x] Edge case - empty array `[]` accepted
  - [x] Test

### Tag Config Pseudo-Class Declaration

- [ ] Extend `BaseHTMLTagConfig` with optional `cssPseudoClass: string[]` field
  - [ ] Type validation - accepts tag with valid pseudo-class references
  - [ ] Type validation - rejects pseudo-class name not starting with `:`
  - [ ] Type validation - rejects pseudo-class name that doesn't exist in any variation
  - [ ] Type validation - tag without `cssPseudoClass` key = no pseudo-class support
  - [ ] Type validation - tag with `cssPseudoClass: []` = no pseudo-class support
  - [ ] Runtime validation - throws for pseudo-class name not in any existing variation config
  - [ ] Runtime validation - accepts empty pseudo-class list
  - [ ] Runtime validation - preserves object reference
  - [ ] Edge case - multiple tags with different pseudo-class lists
  - [ ] Test

### Component CSS: Pseudo-Class Block Validation

- [ ] Extend `ValidateComponentCSSStructure` to validate pseudo-class blocks against tag's `cssPseudoClass`
  - [ ] Type validation - pseudo-class with all its CSS properties passes (using shared variation's scoped properties)
  - [ ] Type validation - pseudo-class on tag that doesn't declare it is rejected
  - [ ] Type validation - pseudo-class on tag with `cssPseudoClass: []` is rejected
  - [ ] Type validation - pseudo-class on tag with no `cssPseudoClass` key is rejected
  - [ ] Type validation - multiple pseudo-classes in same css block accepted
  - [ ] Type validation - pseudo-class inside child selector (`> child: { ":hover": {...} }`)
  - [ ] Type validation - child selector inside pseudo-class (`":hover": { "> child": {...} }`)
  - [ ] Type validation - pseudo-class inside nested pseudo-class (`":hover": { ":focus": {...} }`)
  - [ ] Test

---

### Pseudo-Element Config Builder

- [ ] **`cssPseudoElementConfig` function** - validates a pseudo-element config array
  - [ ] Type validation - accepts `::` prefixed strings
  - [ ] Type validation - rejects names without `::` prefix
  - [ ] Runtime validation - throws for missing `::` prefix
  - [ ] Runtime validation - returns config unchanged
  - [ ] Edge case - empty array `[]` accepted
  - [ ] Test

### Tag Config Pseudo-Element Declaration

- [x] Extend `BaseHTMLTagConfig` with optional `cssPseudoElement: string[]` field
  - [x] Type validation - accepts tag with valid pseudo-element references
  - [x] Type validation - rejects pseudo-element name not starting with `::`
  - [x] Type validation - tag without `cssPseudoElement` key = no pseudo-element support
  - [x] Type validation - tag with `cssPseudoElement: []` = no pseudo-element support
  - [x] Runtime validation - validates pseudo-element config passes through
  - [x] Edge case - multiple tags with different pseudo-element lists
  - [x] Test

### Component CSS: Pseudo-Element Block Validation

- [ ] Extend `ValidateComponentCSSStructure` to validate pseudo-element blocks against tag's `cssPseudoElement`
  - [ ] Type validation - pseudo-element with all its CSS properties passes
  - [ ] Type validation - pseudo-element on tag that doesn't declare it is rejected
  - [ ] Type validation - pseudo-element on tag with `cssPseudoElement: []` is rejected
  - [ ] Type validation - pseudo-element on tag with no `cssPseudoElement` key is rejected
  - [ ] Type validation - multiple pseudo-elements in same css block accepted
  - [ ] Type validation - pseudo-element inside child selector (`> child: { "::placeholder": {...} }`)
  - [ ] Type validation - child selector inside pseudo-element (`"::placeholder": { "> child": {...} }`)
  - [ ] Type validation - pseudo-element inside pseudo-class (`":hover": { "::placeholder": {...} }`)
  - [ ] Type validation - pseudo-class inside pseudo-element (`"::placeholder": { ":hover": {...} }`)
  - [ ] Test

---

### Variation System (Tag-level)

- [ ] Extend `BaseHTMLTagConfig` with optional `variations` field
  - [ ] Each variation maps a name to a partial CSS block
  - [ ] Variation CSS validated against CSSAttributesConfig + CSSPropertiesConfig
  - [ ] Type validation - rejects variation with invalid DSL
  - [ ] Type validation - rejects variation with unknown CSS property
  - [ ] Type validation - rejects variation with `--` property not in CSSPropertiesConfig
  - [ ] Type validation - accepts tag with empty variations `{}`
  - [ ] Type validation - accepts tag without `variations` key
  - [ ] Runtime validation - throws for invalid DSL in variation CSS
  - [ ] Runtime validation - preserves object reference
  - [ ] Edge case - multiple tags with different variation sets
  - [ ] Test

### Component Variation Selection

- [ ] Component selects variation via `attributes.variant`
  - [ ] Type validation - valid `variant` matching a variation passes
  - [ ] Type validation - `variant` value not in variations is rejected
  - [ ] Type validation - `variant` on tag with no variations is rejected
  - [ ] Type validation - component without `variant` on tag with variations accepted
  - [ ] Variation CSS merged with inline `css` (inline overrides)
  - [ ] Pseudo blocks in component css work after variant merge
  - [ ] Pseudo block can override variation's CSS properties
  - [ ] Test
