import {
  AST_NODE_TYPES,
  ASTUtils,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { closest } from "fastest-levenshtein";
import { createRule } from "../utils/create-rule";
import { getSettings } from "../utils/settings";
import {
  getTranslations,
  getKeysFromTranslations,
  hasKeyInTranslation,
} from "../utils/translations";

type Options = [];

const MESSAGES = {
  "non-existing-key":
    'The key "{{ key }}" does not exist in any of the translation files. Did you mean "{{ closestKey }}"? To add a new key make sure to define it in the translation files',
  "missing-key-in-file":
    'The key "{{ key }}" is missing in {{ filePath }} even though it exists in some of the translation files',
  "empty-attribute": "The attribute i18nKey must not be empty if defined",
  "dynamic-key": "The value of i18nKey must be a static string",
  "wrong-key-type": "The value of i18nKey must be a string",
} as const;

export default createRule<Options, keyof typeof MESSAGES>({
  name: "valid-key",
  meta: {
    docs: {
      description: "Validate i18next keys in Reade code",
      recommended: "error",
      requiresTypeChecking: false,
    },
    messages: MESSAGES,
    type: "problem",
    schema: {},
  },
  defaultOptions: [],
  create: function (context) {
    if (!context.getCwd) {
      throw new Error("can't get cwd");
    }

    const cwd = context.getCwd();
    const settings = getSettings(context);
    const translations = getTranslations(
      cwd,
      settings.translationFiles.location
    );
    const keys = getKeysFromTranslations(
      settings.translationFiles.format,
      translations
    );
    const keysArray = Array.from(keys);

    return {
      JSXElement: (element) => {
        if (isTransElement(element)) {
          const attribute =
            element.openingElement.attributes.find(isI18nKeyAttribute);

          if (!attribute) {
            return;
          }

          if (!attribute.value) {
            context.report({
              messageId: "empty-attribute",
              node: attribute,
            });
            return;
          }

          const staticValue = ASTUtils.getStaticValue(
            attribute.value.type === AST_NODE_TYPES.JSXExpressionContainer
              ? attribute.value.expression
              : attribute.value,
            context.getScope()
          );

          if (!staticValue) {
            context.report({
              messageId: "dynamic-key",
              node: attribute,
            });
            return;
          }

          if (typeof staticValue.value !== "string") {
            context.report({
              messageId: "wrong-key-type",
              node: attribute,
            });
            return;
          }

          const key = staticValue.value;

          if (!keys.has(key)) {
            context.report({
              messageId: "non-existing-key",
              node: attribute,
              data: {
                key,
                closestKey: closest(key, keysArray),
              },
            });
            return;
          }

          for (const [filePath, translation] of Object.entries(translations)) {
            if (
              !hasKeyInTranslation(
                settings.translationFiles.format,
                translation,
                key
              )
            ) {
              context.report({
                messageId: "missing-key-in-file",
                node: attribute,
                data: {
                  key,
                  filePath,
                },
              });
            }
          }
        }
      },
    };
  },
});

function isTransElement(element: TSESTree.JSXElement): boolean {
  return (
    element.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
    element.openingElement.name.name === "Trans"
  );
}

function isI18nKeyAttribute(
  attribute: TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute
): attribute is TSESTree.JSXAttribute {
  return (
    attribute.type === AST_NODE_TYPES.JSXAttribute &&
    attribute.name.name === "i18nKey"
  );
}
