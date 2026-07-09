import { cssAttributeConfig } from "@/css/attribute-config/index.ts";
import minimalCSSSyntax from "@/css/syntax-config/variations/minimal.ts";
import { SUPPORTED_KEYWORDS } from "@/dsl/index.ts";

export default cssAttributeConfig(SUPPORTED_KEYWORDS, minimalCSSSyntax, {
  // ── Box Model ──────────────────────────────────────────────────────────────
  width: "<length>",
  height: "<length>",
  margin: "<length>",
  padding: "<length>",

  // ── Layout ─────────────────────────────────────────────────────────────────
  display: "'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'",
  position: "'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'",
  top: "<length>",
  right: "<length>",
  bottom: "<length>",
  left: "<length>",
  "z-index": "<integer>",
  overflow: "'visible' | 'hidden' | 'scroll' | 'auto'",

  // ── Flexbox ────────────────────────────────────────────────────────────────
  "flex-direction": "'row' | 'row-reverse' | 'column' | 'column-reverse'",
  "justify-content":
    "'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'",
  "align-items":
    "'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline'",
  gap: "<length>",

  // ── Colors & Background ────────────────────────────────────────────────────
  color: "<color>",
  "background-color": "<color>",

  // ── Border ─────────────────────────────────────────────────────────────────
  "border-radius": "<length>",
  "border-width": "<line-width>",
  "border-style": "<line-style>",
  "border-color": "<color>",

  // ── Typography ─────────────────────────────────────────────────────────────
  "font-size": "<length>",
  "font-weight": "<font-weight>",
  "line-height": "<number>",
  "text-align": "'left' | 'right' | 'center' | 'justify'",
  "text-transform": "'none' | 'uppercase' | 'lowercase' | 'capitalize'",

  // ── Visibility & Interaction ───────────────────────────────────────────────
  visibility: "'visible' | 'hidden'",
  "pointer-events": "'auto' | 'none'",
  cursor: "'auto' | 'default' | 'pointer' | 'text' | 'not-allowed' | 'none'",

  // ── Transitions ────────────────────────────────────────────────────────────
  "transition-duration": "<time>",
  "transition-timing-function": "<easing-function>",
});
