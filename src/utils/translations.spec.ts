import { TranslationFilesFormat } from "./settings";
import { Translations, getKeysFromTranslations } from "./translations";

describe("getKeysFromTranslations()", () => {
  const cases: Array<
    [
      name: string,
      format: TranslationFilesFormat,
      translations: Translations,
      expected: Set<string>
    ]
  > = [
    [
      "flat",
      TranslationFilesFormat.Flat,
      { "en.json": { key: "value" } },
      new Set(["key"]),
    ],
    [
      "nested",
      TranslationFilesFormat.Nested,
      { "en.json": { nested: { key: "value" } } },
      new Set(["nested.key"]),
    ],
  ];
  test.each(cases)("%s", (name, format, translations, expected) => {
    expect(getKeysFromTranslations(format, translations)).toEqual(expected);
  });
});
