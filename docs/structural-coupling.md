# Structural Coupling: CSS That Cannot Outlive Its Markup

## The aim

The core problem this library exists to solve is **not** writing HTML or CSS —
it is *changing* them. When the structure of the HTML changes and the CSS that
targeted the old structure is forgotten, nothing fails: selectors silently stop
matching, dead rules accumulate, and the stylesheet drifts away from the markup
it describes. No mainstream tool catches this. CSS Modules can prove a *class*
exists; nothing proves the *structure* a selector assumes still exists.

Here, a component's CSS is keyed off the component's own structure:

- children are **named** (`innerHTML: { title: ... }`), so styles have stable
  structural handles instead of positional/tag selectors,
- child selectors (`> title`) are typed as keys of that structure,
- so renaming, removing, or moving a child makes the CSS that targeted it a
  **compile error at the same call site**.

Change the structure and the stale CSS is not a runtime surprise or a visual
bug — it is a red squiggle.

## Two walls, one contract

Every rule is enforced twice, by design:

1. **Type level** — `ValidateComponentStructure` rewrites invalid structures
   into error types. This is the interactive wall: humans get it in the
   editor, AI agents get it from `tsc`.
2. **Runtime** — `validateComponentNode` walks the real object and throws
   with a structured message. This is the backstop wall: it holds even when
   the type layer is bypassed (`as any`, generated code, data from outside
   the compiler's view).

The two layers are required to agree; divergence is treated as a bug (see
"Known gaps" below for the one currently known divergence).

## Verified guarantees

These were established by direct experiment (2026-07), not by intention.
Semantics used: `h1 > b` is valid standalone, but `a` does not allow `b`, so
`a > h1 > b` must fail the inheritance intersection (`a.innerHTML ∩
h1.innerHTML`).

| Scenario | Type level | Runtime |
|---|---|---|
| Inline `a > h1 > b` | rejected | rejected |
| `h1 > b` built by its own `createComponent`, then embedded under `<a>` | rejected at the parent call | rejected |
| Factory with widened return type (`BaseComponentStructure`) embedded under `<a>` | rejected — fails **closed** | rejected |
| Parent css `> heading` targeting a prebuilt child | accepted | accepted |
| Parent css `> headnig` (typo) | rejected | **accepted — known gap** |

Key consequences:

- **Composition does not weaken validation.** `createComponent` returns the
  full literal type, so a parent re-validates the entire subtree under its own
  ancestral context, and the runtime walks the whole tree at the parent call.
  Splitting components across files keeps every guarantee.
- **Widening fails closed, not open.** A component whose type has been widened
  cannot be embedded at all — the type system refuses rather than trusting it.
  Safe, but it imposes the constraint below.

## Performance envelope (measured)

Structural typing at this depth is only viable if it stays cheap. Measured
against the `common` and `full` config variations:

- `tsc` cost is **linear**: ~4.8K instantiations / ~5ms check time per
  component (1 → 400 components: 124K → 2.05M instantiations, 0.36s → 2.4s).
- Editor (tsserver): warm completions inside a `css` block 8–18ms; completion
  immediately after an edit ~210ms (`common`) / ~370ms (`full`); full-file
  semantic check of a 5-component file ~43ms.

Practical rule: keep files to a handful of components each and editor latency
is a non-issue. The post-edit constant grows with *config breadth*, not
component size.

## Constraints on authors

- **Let inference flow.** Do not annotate component factory return types with
  widened types (`BaseComponentStructure`, hand-written interfaces). The
  literal type *is* the validation artifact; widening it makes the component
  unusable as a child (deliberately).
- **Name children meaningfully.** The `innerHTML` keys are the selector
  namespace — they appear in css blocks (`> title`) and in rendered scoped CSS
  (`cid-title`).

## Known gaps

Tracked in `TASK.md`:

- Runtime does not yet validate `> childName` css selector keys against
  `innerHTML` keys (type level does). Until fixed, a typo'd child selector can
  survive if the type layer is bypassed.
- Runtime does not yet validate css *property values* during render
  (`renderComponent`), only during `createComponent`.

## Non-goals

- Reimplementing the full CSS value grammar in the type system. The moat is
  the structure↔style coupling and the closed-world registries, not proving
  `calc(100% - 20px)` correct at the type level. Grammar features are added
  only where they serve the coupling (e.g. `var()` resolution against the
  property registry).
- Being a rendering framework. Output is plain HTML and CSS strings; how they
  are served is the caller's concern.
