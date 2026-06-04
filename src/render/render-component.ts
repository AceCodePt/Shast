import { type SharedAttributeConfig } from "../config/shared-attribute-config.ts";
import { type BaseTagConfig } from "../config/tag-config.ts";
import { type AnyComponentNode } from "../create-component.ts";

export function renderComponent<
  TTagConfig extends BaseTagConfig,
  TGlobalConfig extends SharedAttributeConfig,
>(
  htmlTagAttributes: TTagConfig,
  node: AnyComponentNode<TTagConfig, TGlobalConfig>,
): string {
  const record = node;
  const tag = record.tag;
  const innerHTML = record.innerHTML;

  // ==========================================
  // 1. SERIALIZE ATTRIBUTES
  // ==========================================
  let attributesHtml = "";

  for (const [key, value] of Object.entries(
    record as Record<string, unknown>,
  )) {
    if (key === "tag" || key === "innerHTML") continue;
    if (value === undefined || value === false) continue;

    if (value === true) {
      attributesHtml += ` ${key}`;
      continue;
    }

    attributesHtml += ` ${key}="${String(value)}"`;
  }

  const schemaForTag = htmlTagAttributes[tag];
  const isVoidElement =
    schemaForTag &&
    Array.isArray(schemaForTag.innerHTML) &&
    schemaForTag.innerHTML.length === 0;

  if (isVoidElement) {
    return `<${tag}${attributesHtml}>`; // No closing tag, purely schema-driven
  }

  let childrenHtml = "";

  if (typeof innerHTML === "string") {
    childrenHtml = innerHTML;
  } else if (Array.isArray(innerHTML)) {
    for (const childDict of innerHTML) {
      if (childDict && typeof childDict === "object") {
        for (const childNode of Object.values(childDict)) {
          if (
            childNode &&
            typeof childNode === "object" &&
            "tag" in childNode
          ) {
            childrenHtml += renderComponent(
              htmlTagAttributes,
              childNode as AnyComponentNode<TTagConfig, TGlobalConfig>,
            );
          }
        }
      }
    }
  }

  return `<${tag}${attributesHtml}>${childrenHtml}</${tag}>`;
}
