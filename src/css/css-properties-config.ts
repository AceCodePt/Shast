import type { BaseCSSSyntaxConfig } from "./syntax-config/index.ts";

export type BaseCSSProperty<
  SyntaxKeysConfig extends BaseCSSSyntaxConfig,
  Syntax extends keyof SyntaxKeysConfig,
> = {
  syntax: Syntax;
  inherits: boolean;
  "initial-value": SyntaxKeysConfig[Syntax];
};

export type ValidCSSProperty<S extends BaseCSSSyntaxConfig> = {
  [K in keyof S]: BaseCSSProperty<S, K>;
}[keyof S];

export type CSSPropertyRegistry<S extends BaseCSSSyntaxConfig> = Record<
  string,
  ValidCSSProperty<S>
>;

export function cssPropertiesConfig<
  const S extends BaseCSSSyntaxConfig,
  const T extends CSSPropertyRegistry<S>,
>(_syntax: S, config: T) {
  return config;
}
