import { RuleTester } from "@typescript-eslint/experimental-utils/dist/eslint-utils";
import { RawSettings } from "../utils/settings";
import rule from "./valid-key";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const FLAT_SETTINGS: RawSettings = {
  "@flycode-org/react-i18next": {
    translationFiles: {
      location: "test/fixtures/flat/*.json",
      format: "flat",
    },
  },
};

const NESTED_SETTINGS: RawSettings = {
  "@flycode-org/react-i18next": {
    translationFiles: {
      location: "test/fixtures/nested/*.json",
      format: "nested",
    },
  },
};

ruleTester.run("valid-key", rule, {
  valid: [
    {
      code: `<Trans i18nKey="valid" />`,
      settings: FLAT_SETTINGS,
    },
    {
      code: `<Trans i18nKey="nested.valid" />`,
      settings: NESTED_SETTINGS,
    },
  ],
  invalid: [
    {
      code: `<Trans i18nKey />`,
      settings: FLAT_SETTINGS,
      errors: [
        {
          messageId: "empty-attribute",
          data: { filePath: "test/fixtures/flat/en-US.json" },
        },
      ],
    },
    {
      code: `<Trans i18nKey={dynamicKey} />`,
      settings: FLAT_SETTINGS,
      errors: [
        {
          messageId: "dynamic-key",
          data: { filePath: "test/fixtures/flat/en-US.json" },
        },
      ],
    },
    {
      code: `<Trans i18nKey={42} />`,
      settings: FLAT_SETTINGS,
      errors: [
        {
          messageId: "wrong-key-type",
          data: { filePath: "test/fixtures/flat/en-US.json" },
        },
      ],
    },
    {
      code: `<Trans i18nKey="invalid" />`,
      settings: FLAT_SETTINGS,
      errors: [
        {
          messageId: "non-existing-key",
          data: {
            key: "invalid",
            closestKey: "valid",
          },
        },
      ],
    },
    {
      code: `<Trans i18nKey="nested.invalid" />`,
      settings: NESTED_SETTINGS,
      errors: [
        {
          messageId: "non-existing-key",
          data: {
            key: "nested.invalid",
            closestKey: "nested.valid",
          },
        },
      ],
    },
    {
      code: `<Trans i18nKey="onlyInEn" />`,
      settings: FLAT_SETTINGS,
      errors: [
        {
          messageId: "missing-key-in-file",
          data: {
            key: "onlyInEn",
            filePath: "test/fixtures/flat/es-ES.json",
          },
        },
      ],
    },
  ],
});
