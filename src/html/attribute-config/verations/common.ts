import { htmlAttributeConfig } from "../index.ts";

export default htmlAttributeConfig({
  id: "string | undefined",
  class: "string | undefined",
  style: "string | undefined",
  title: "string | undefined",
  lang: "string | undefined",
  dir: "'ltr' | 'rtl' | 'auto' | undefined",
  tabindex: "number | undefined",
});
