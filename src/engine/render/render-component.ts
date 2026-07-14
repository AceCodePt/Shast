import type { BaseComponentStructure } from "@/engine/types.ts";
import type { BaseHTMLTagConfig } from "@/html/tag-config/types.ts";

const INDENT_UNIT = "  ";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function hashNode(node: unknown): string {
  const input = stableStringify(node);
  // FNV-1a (32-bit)
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

const PREFIX = "cid-";

function hashAttribute(node: BaseComponentStructure): string {
  return `${PREFIX}${hashNode(node)}`;
}

function semanticAttribute(name: string): string {
  return `${PREFIX}${name}`;
}

function attributeSelector(attribute: string): string {
  return `[${attribute}]`;
}

function isRecordInnerHTML(
  innerHTML: unknown,
): innerHTML is Record<string, unknown> {
  return (
    innerHTML !== null &&
    typeof innerHTML === "object" &&
    !Array.isArray(innerHTML)
  );
}

function hasCSS(node: BaseComponentStructure): boolean {
  return node.css !== undefined && node.css !== null;
}

function renderAttributes(attributes: Record<string, unknown>): string {
  let html = "";
  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null || value === false) continue;
    if (value === true) {
      html += ` ${key}`;
      continue;
    }
    html += ` ${key}="${String(value)}"`;
  }
  return html;
}

function renderHTMLNode(
  tagConfig: BaseHTMLTagConfig,
  node: BaseComponentStructure,
  semanticName: string | undefined,
): string {
  const tag = node.tag as string;

  const identifiers: string[] = [];
  if (semanticName !== undefined) {
    identifiers.push(semanticAttribute(semanticName));
  }
  if (hasCSS(node)) {
    identifiers.push(hashAttribute(node));
  }

  const attributesHTML =
    identifiers.map((id) => ` ${id}`).join("") +
    renderAttributes(node.attributes ?? {});

  const tagDefinition = tagConfig[tag];
  const isVoidElement =
    tagDefinition !== undefined &&
    Array.isArray(tagDefinition.innerHTML) &&
    tagDefinition.innerHTML.length === 0;

  if (isVoidElement) {
    return `<${tag}${attributesHTML}>`;
  }

  const innerHTML =
    "innerHTML" in node && node["innerHTML"] ? node["innerHTML"] : undefined;
  let childrenHTML = "";

  if (typeof innerHTML === "string") {
    childrenHTML = innerHTML;
  } else if (isRecordInnerHTML(innerHTML)) {
    for (const [key, child] of Object.entries(innerHTML)) {
      if (typeof child === "string") {
        childrenHTML += child;
      } else if (child !== null && typeof child === "object") {
        childrenHTML += renderHTMLNode(
          tagConfig,
          child as BaseComponentStructure,
          key,
        );
      }
    }
  }

  return `<${tag}${attributesHTML}>${childrenHTML}</${tag}>`;
}

function resolveChild(
  node: BaseComponentStructure,
  childName: string,
): BaseComponentStructure | undefined {
  const innerHTML =
    "innerHTML" in node && node["innerHTML"] ? node["innerHTML"] : undefined;
  if (!isRecordInnerHTML(innerHTML)) return undefined;
  const child = innerHTML[childName];
  return child !== null && typeof child === "object"
    ? (child as BaseComponentStructure)
    : undefined;
}

function renderRule(
  selector: string,
  cssBlock: Record<string, unknown>,
  node: BaseComponentStructure,
  indent: number,
): string | null {
  const declarations: string[] = [];
  const nestedRules: string[] = [];

  for (const [key, value] of Object.entries(cssBlock)) {
    if (key.startsWith("> ")) {
      const childName = key.slice(2);
      const childNode = resolveChild(node, childName);
      if (
        childNode !== undefined &&
        value !== null &&
        typeof value === "object"
      ) {
        const rule = renderRule(
          `& > ${attributeSelector(semanticAttribute(childName))}`,
          value as Record<string, unknown>,
          childNode,
          indent + 1,
        );
        if (rule !== null) nestedRules.push(rule);
      }
    } else if (key.startsWith(":")) {
      // Pseudo-class (`:hover`) or pseudo-element (`::before`).
      if (value !== null && typeof value === "object") {
        const rule = renderRule(
          `&${key}`,
          value as Record<string, unknown>,
          node,
          indent + 1,
        );
        if (rule !== null) nestedRules.push(rule);
      }
    } else {
      declarations.push(`${key}: ${String(value)};`);
    }
  }

  if (declarations.length === 0 && nestedRules.length === 0) {
    return null;
  }

  const pad = INDENT_UNIT.repeat(indent);
  const innerPad = INDENT_UNIT.repeat(indent + 1);
  const body = [
    ...declarations.map((declaration) => `${innerPad}${declaration}`),
    ...nestedRules,
  ].join("\n");

  return `${pad}${selector} {\n${body}\n${pad}}`;
}

function collectCSS(node: BaseComponentStructure): string[] {
  const rules: string[] = [];

  if (hasCSS(node)) {
    const rule = renderRule(
      attributeSelector(hashAttribute(node)),
      node.css as Record<string, unknown>,
      node,
      0,
    );
    if (rule !== null) rules.push(rule);
  }

  const innerHTML =
    "innerHTML" in node && node["innerHTML"] ? node["innerHTML"] : undefined;
  if (isRecordInnerHTML(innerHTML)) {
    for (const child of Object.values(innerHTML)) {
      if (child !== null && typeof child === "object") {
        rules.push(...collectCSS(child as BaseComponentStructure));
      }
    }
  }

  return rules;
}

export function renderComponent(
  tagConfig: BaseHTMLTagConfig,
  node: BaseComponentStructure,
): { html: string; css: string } {
  return {
    html: renderHTMLNode(tagConfig, node, undefined),
    css: collectCSS(node).join("\n\n"),
  };
}
