import type { Keyof } from "@/types.ts";
import type { BaseHTMLTagConfig, ValidateHTMLTagConfig } from "./types.ts";

export const htmlTagConfig = <const T extends BaseHTMLTagConfig<Keyof<T>>>(
  config: ValidateHTMLTagConfig<T>,
) => {
  return config as T;
};
