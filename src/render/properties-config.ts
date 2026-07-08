import type { BaseCSSPropertiesConfig } from "@/css/properties-config/types.ts";

export function renderCSSPropertiesConfig(
  config: BaseCSSPropertiesConfig,
): string {
  const entries = Object.entries(config);

  const parts: string[] = [];
  for (const [key, value] of entries) {
    if (!key.startsWith("--")) {
      throw new Error(
        `You must have the property start with -- instead like --${key}`,
      );
    }

    if (value["initial-value"] === undefined) {
      throw new Error(
        `initial-value is required for property "${key}"`,
      );
    }

    let block = `@property ${key} {\n`;
    block += `  syntax: "${value.syntax}";\n`;
    block += `  inherits: ${value.inherits};\n`;
    block += `  initial-value: ${value["initial-value"]};\n`;
    block += `}`;
    parts.push(block);
  }

  return parts.join("\n\n");
}
