import * as fs from "fs";
import fastGlob from "fast-glob";
import flat from "flat";
import { TranslationFilesFormat } from "./settings";
import has from "lodash.has";

export type Translation = object;
export type Translations = Record<string, Translation>;

export function getTranslations(cwd: string, location: string[]): Translations {
  const translations = Object.fromEntries(
    location.flatMap((source) => {
      const filePaths = fastGlob.sync(source, { cwd });
      return filePaths.map((filePath) => {
        const raw = fs.readFileSync(filePath, "utf-8");
        let parsed: Translation;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error(
            "Invalid translation file: the file's content is not a valid JSON document"
          );
        }
        if (!parsed || typeof parsed !== "object") {
          throw new Error(
            "Invalid translation file: the file's content should contain a JSON object"
          );
        }
        return [filePath, parsed];
      });
    })
  );

  return translations;
}

export function getKeysFromTranslations(
  format: TranslationFilesFormat,
  translations: Translations
): Set<string> {
  return new Set(
    Object.values(translations).flatMap((translation) => {
      if (format === TranslationFilesFormat.Flat) {
        return Object.keys(translation);
      }
      return Object.keys(flat(translation));
    })
  );
}

export function hasKeyInTranslation(
  format: TranslationFilesFormat,
  translation: Translation,
  key: string
): boolean {
  switch (format) {
    case TranslationFilesFormat.Flat: {
      return key in translation;
    }
    case TranslationFilesFormat.Nested: {
      return has(translation, key);
    }
    default: {
      throw new Error("Not implemented");
    }
  }
}
