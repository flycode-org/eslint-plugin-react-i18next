# `@flycode-org/react-i18next/valid-key`

## Short Description

Validate i18next keys in Reade code

## Long Description

This rule validates the value of the `i18nKey` attribute evaluates to a key that exists in all the translation files in the project.

## Usage

```json
{
  "rules": {
    "@flycode-org/react-i18next/valid-key": "error"
  },
  "settings": {
    "@flycode-org/react-i18next": {
      "translationFiles": {
        "location": "public/locales/*/translation.json",
        "format": "flat"
      }
    }
  }
}
```
