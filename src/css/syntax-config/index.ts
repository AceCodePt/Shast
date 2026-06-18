import type { BaseCSSSyntaxConfig, ValidatedCSSSyntaxConfig } from "./types.ts";

export function cssSyntaxConfig<const T extends BaseCSSSyntaxConfig>(
  config: ValidatedCSSSyntaxConfig<T>,
) {
  return config as T;
}
