import type {
  BaseHTMLAttributeConfig,
  ValidateHTMLAttributeConfig,
} from "./types.ts";

export const htmlAttributeConfig = <const A extends BaseHTMLAttributeConfig>(
  config: ValidateHTMLAttributeConfig<A>,
) => {
  // for (const [key, value] of Object.entries(config)) {
  //   validateDSL(value, key);
  // }
  return config as A;
};
