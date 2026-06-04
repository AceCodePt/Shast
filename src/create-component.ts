import { SharedAttributeConfig } from "./config/shared-attribute-config";
import { BaseTagConfig } from "./config/tag-config";

export type ComponentDictionary<
  TTagConfig extends BaseTagConfig,
  TGlobalConfig extends SharedAttributeConfig,
> = {
  [key: string]: AnyComponentNode<TTagConfig, TGlobalConfig>;
};

export type AnyComponentNode<
  TTagConfig extends BaseTagConfig,
  TGlobalConfig extends SharedAttributeConfig,
> = {
  [K in keyof TTagConfig]: ComponentNode<K & string, TTagConfig, TGlobalConfig>;
}[keyof TTagConfig];

type MergedSchema<
  T extends string,
  TTagConfig extends BaseTagConfig,
  TGlobalConfig extends SharedAttributeConfig,
> = (T extends keyof TTagConfig ? TTagConfig[T] : {}) & TGlobalConfig;

export type ComponentNode<
  T extends string,
  TTagConfig extends BaseTagConfig,
  TGlobalConfig extends SharedAttributeConfig,
> = {
  tag: T;
  innerHTML?: T extends keyof TTagConfig
    ? TTagConfig[T] extends { innerHTML: infer I }
      ? I extends readonly []
        ? never
        : string | ComponentDictionary<TTagConfig, TGlobalConfig>[]
      : never
    : never;
} & {
  [K in keyof MergedSchema<
    T,
    TTagConfig,
    TGlobalConfig
  > as K extends "innerHTML"
    ? never
    : undefined extends MergedSchema<T, TTagConfig, TGlobalConfig>[K]
      ? never
      : K]: MergedSchema<T, TTagConfig, TGlobalConfig>[K];
} & {
  [K in keyof MergedSchema<
    T,
    TTagConfig,
    TGlobalConfig
  > as K extends "innerHTML"
    ? never
    : undefined extends MergedSchema<T, TTagConfig, TGlobalConfig>[K]
      ? K
      : never]?: Exclude<
    MergedSchema<T, TTagConfig, TGlobalConfig>[K],
    undefined
  >;
};

export function validateComponent<
  TTagConfig extends BaseTagConfig,
  TGlobalConfig extends SharedAttributeConfig,
>(
  htmlTagAttributes: TTagConfig,
  globalAttributes: TGlobalConfig,
  node: unknown,
): asserts node is AnyComponentNode<TTagConfig, TGlobalConfig> {
  if (!node || typeof node !== "object") {
    throw new Error(
      "Validation Error: Provided node is not a valid component object.",
    );
  }

  const nodeRecord = node as Record<string, unknown>;

  if (typeof nodeRecord.tag !== "string") {
    throw new Error(
      "Validation Error: Component node is missing a valid string 'tag' property.",
    );
  }

  const tag = nodeRecord.tag;
  const schemaForTag = htmlTagAttributes[tag as keyof TTagConfig];

  if (!schemaForTag) return;

  const tagRecord = schemaForTag as Record<string, unknown>;

  for (const [attrKey, attrValue] of Object.entries(nodeRecord)) {
    if (attrKey === "tag" || attrKey === "innerHTML") continue;

    const tagAttrExpectation = tagRecord[attrKey];
    const globalAttrExpectation = globalAttributes[attrKey];

    if (
      tagAttrExpectation === undefined &&
      globalAttrExpectation === undefined
    ) {
      throw new Error(
        `Attribute Error: Property '${attrKey}' is not a valid attribute for <${tag}> or the Global configuration registry.`,
      );
    }

    const expectedTypeDefinition =
      tagAttrExpectation !== undefined
        ? tagAttrExpectation
        : globalAttrExpectation;
    const actualType = typeof attrValue;

    if (
      typeof expectedTypeDefinition === "boolean" &&
      actualType !== "boolean"
    ) {
      throw new Error(
        `Type Mismatch: Attribute '${attrKey}' on <${tag}> expects a boolean, but received a ${actualType}.`,
      );
    }
    if (typeof expectedTypeDefinition === "number" && actualType !== "number") {
      throw new Error(
        `Type Mismatch: Attribute '${attrKey}' on <${tag}> expects a number, but received a ${actualType}.`,
      );
    }
    if (typeof expectedTypeDefinition === "string" && actualType !== "string") {
      throw new Error(
        `Type Mismatch: Attribute '${attrKey}' on <${tag}> expects a string, but received a ${actualType}.`,
      );
    }
  }

  const innerHTMLRule = tagRecord.innerHTML;
  const innerHTMLValue = nodeRecord.innerHTML;

  if (Array.isArray(innerHTMLRule) && innerHTMLRule.length === 0) {
    if (innerHTMLValue !== undefined) {
      throw new Error(
        `Validation Error: Tag '<${tag}>' is configured as a void element and must not contain any innerHTML or children.`,
      );
    }
    return;
  }

  if (innerHTMLValue === undefined) return;

  if (typeof innerHTMLValue === "string") {
    if (
      innerHTMLRule === "*" ||
      (Array.isArray(innerHTMLRule) && innerHTMLRule.includes("#text"))
    ) {
      return;
    }
    throw new Error(
      `Validation Error: Tag '<${tag}>' does not accept raw text content.`,
    );
  }

  if (Array.isArray(innerHTMLValue)) {
    const childDictionaries = innerHTMLValue as ComponentDictionary<
      TTagConfig,
      TGlobalConfig
    >[];

    if (innerHTMLRule === "*" || innerHTMLRule === undefined) {
      for (const childDict of childDictionaries) {
        for (const childNode of Object.values(childDict)) {
          validateComponent(htmlTagAttributes, globalAttributes, childNode);
        }
      }
    } else if (Array.isArray(innerHTMLRule)) {
      for (const childDict of childDictionaries) {
        for (const childNode of Object.values(childDict)) {
          if (
            childNode &&
            typeof childNode === "object" &&
            "tag" in childNode &&
            typeof childNode.tag === "string"
          ) {
            const childTag = childNode.tag;

            if (!(innerHTMLRule as readonly string[]).includes(childTag)) {
              throw new Error(
                `Structural Error: '<${tag}>' cannot contain a '<${childTag}>' element. Allowed elements: [${(innerHTMLRule as readonly string[]).join(", ")}]`,
              );
            }
            validateComponent(htmlTagAttributes, globalAttributes, childNode);
          } else {
            throw new Error(
              `Structural Error: Invalid child node detected inside '<${tag}>'.`,
            );
          }
        }
      }
    }
  }
}

export function createComponent<
  TTagConfig extends BaseTagConfig,
  TGlobalConfig extends SharedAttributeConfig,
  const TNode extends AnyComponentNode<TTagConfig, TGlobalConfig>,
>(htmlTagAttributes: TTagConfig, globalAttributes: TGlobalConfig, node: TNode) {
  validateComponent(htmlTagAttributes, globalAttributes, node);
  return node;
}
