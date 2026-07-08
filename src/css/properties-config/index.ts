import { dslString } from "@/dsl/index.ts";
import type { BaseCSSSyntaxConfig } from "../syntax-config/types.ts";
import type {
  BaseCSSPropertiesConfig,
  ValidateCSSPropertiesConfig,
} from "./types.ts";

function validateInitialValueAgainstSyntax(
  syntaxDsl: string,
  initialValue: string,
): void {
  // Split by top-level pipes (outside quotes and backticks)
  const parts: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;

  for (let i = 0; i < syntaxDsl.length; i++) {
    const ch = syntaxDsl[i];
    if (ch === "'" && !inDouble && !inBacktick) inSingle = !inSingle;
    else if (ch === '"' && !inSingle && !inBacktick) inDouble = !inDouble;
    else if (ch === "`" && !inSingle && !inDouble) inBacktick = !inBacktick;
    else if (ch === "|" && !inSingle && !inDouble && !inBacktick) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current.trim());

  let matches = false;

  for (const part of parts) {
    // Direct string literal match: 'value', "value", or `value`
    if (
      (part.startsWith("'") && part.endsWith("'")) ||
      (part.startsWith('"') && part.endsWith('"'))
    ) {
      const value = part.slice(1, -1);
      if (initialValue === value) {
        matches = true;
        break;
      }
    }

    // Template literal pattern match
    if (part.startsWith("`") && part.endsWith("`")) {
      const templateContent = part.slice(1, -1);

      // Pattern: `${number}%` - matches numbers followed by %
      if (templateContent === "${number}%") {
        if (/^\d+(\.\d+)?%$/.test(initialValue)) {
          matches = true;
          break;
        }
      }

      // Pattern: `${number}${...}` - matches number followed by another interpolation
      const numberInterpolationPattern = /^\$\{number\}\$\{(.+)\}$/;
      const numberInterpolationMatch = templateContent.match(numberInterpolationPattern);
      if (numberInterpolationMatch && numberInterpolationMatch[1]) {
        const innerPart = numberInterpolationMatch[1].trim();
        // Extract quoted values: 'px' | 'rem' | 'em'
        const quotedValues = innerPart.match(/'[^']*'/g);
        if (quotedValues) {
          const units = quotedValues.map((v) => v.replace(/'/g, ""));
          for (const unit of units) {
            const numPattern = new RegExp(`^\\d+(\\.\\d+)?${unit}$`);
            if (numPattern.test(initialValue)) {
              matches = true;
              break;
            }
          }
        }
        if (matches) break;
      }

      // Pattern: `${number}` - matches any number
      if (templateContent === "${number}") {
        if (/^\d+(\.\d+)?$/.test(initialValue)) {
          matches = true;
          break;
        }
      }

      // Pattern: `${bigint}` - matches integers
      if (templateContent === "${bigint}") {
        if (/^\d+$/.test(initialValue)) {
          matches = true;
          break;
        }
      }

      // Pattern: `${string}` - matches any string
      if (templateContent === "${string}") {
        matches = true;
        break;
      }

      // Pattern: `#${string}` - matches # followed by string (for colors)
      if (templateContent === "#${string}") {
        if (/^#[a-fA-F0-9]+$/.test(initialValue)) {
          matches = true;
          break;
        }
      }
    }

    // Handle keyword references like <percentage>, <length> (should be resolved before calling)
    if (part.startsWith("<") && part.endsWith(">")) {
      continue;
    }
  }

  if (!matches) {
    throw new Error(
      `Value "${initialValue}" does not match syntax "${syntaxDsl}"`,
    );
  }
}

export const cssPropertiesConfig = <
  const K extends Record<string, any>,
  const S extends BaseCSSSyntaxConfig,
  const P extends BaseCSSPropertiesConfig,
>(
  keywords: K,
  syntaxConfig: S,
  config: ValidateCSSPropertiesConfig<K, S, P>,
) => {
  const entries = config;
  const mergedConfig = Object.assign({}, syntaxConfig, keywords);

  for (const key in entries) {
    if (!key.startsWith("--")) {
      throw new Error(
        `You must have the property start with -- instead like --${key}`,
      );
    }
    const entry = entries[key];
    if (typeof entry === "object" && entry.syntax) {
      dslString(mergedConfig, entry.syntax);

      if (entry["initial-value"] === undefined) {
        throw new Error(
          `initial-value is required for property "${key}"`,
        );
      }

      // Resolve syntax token reference if needed
      let resolvedSyntax = entry.syntax;
      if (
        entry.syntax.startsWith("<") &&
        entry.syntax.endsWith(">") &&
        entry.syntax in mergedConfig
      ) {
        const resolved = mergedConfig[entry.syntax];
        if (typeof resolved === "string") {
          resolvedSyntax = resolved;
        }
      }

      // Validate initial-value matches the resolved syntax if provided
      if (entry["initial-value"] !== undefined) {
        validateInitialValueAgainstSyntax(resolvedSyntax, entry["initial-value"]);
      }
    }
  }
  return config as P;
};
