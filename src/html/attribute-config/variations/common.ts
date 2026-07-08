import { SUPPORTED_KEYWORDS, type DSLInfer } from "@/dsl/index.ts";
import { htmlAttributeConfig } from "../index.ts";

export default htmlAttributeConfig(SUPPORTED_KEYWORDS, {
  id: "string | undefined",
  class: "string | undefined",
  style: "string | undefined",
  title: "string | undefined",
  lang: "string | undefined",
  dir: "'ltr' | 'rtl' | 'auto' | undefined",
  tabindex: "number | undefined",
  role: "string | undefined",
});
