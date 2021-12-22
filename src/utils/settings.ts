export type RawSettingsTranslationFilesLocation = string | string[];
export type RawSettingsTranslationFilesFormat = string;
export type RawSettings = {
  "@flycode-org/react-i18next"?: {
    translationFiles?: {
      location?: RawSettingsTranslationFilesLocation;
      format?: RawSettingsTranslationFilesFormat;
    };
  };
};

export enum TranslationFilesFormat {
  Flat = "flat",
  Nested = "nested",
}

export type Settings = {
  /** Settings for translation files */
  translationFiles: {
    /** Globs of locations of translation files */
    location: string[];
    /** The format of the translation files */
    format: TranslationFilesFormat;
  };
};

const DEFAULT_TRANSLATION_FILES_LOCATION = [
  "public/locales/*/translation.json",
];
const DEFAULT_TRANSLATION_FILES_FORMAT = TranslationFilesFormat.Flat;
const RAW_FORMAT_TO_TRANSLATION_FILES_FORMAT: {
  [key in `${TranslationFilesFormat}`]: TranslationFilesFormat;
} = {
  flat: TranslationFilesFormat.Flat,
  nested: TranslationFilesFormat.Nested,
};

export function getSettings(context: { settings: RawSettings }): Settings {
  const rawSettings = context.settings["@flycode-org/react-i18next"];
  const rawLocation = rawSettings?.translationFiles?.location;
  const rawFormat = rawSettings?.translationFiles?.format;
  return {
    translationFiles: {
      location: rawLocation
        ? normalizeTranslationFiles(rawLocation)
        : DEFAULT_TRANSLATION_FILES_LOCATION,
      format: rawFormat
        ? toFormat(rawFormat)
        : DEFAULT_TRANSLATION_FILES_FORMAT,
    },
  };
}

function normalizeTranslationFiles(
  rawFiles: RawSettingsTranslationFilesLocation
): string[] {
  return Array.isArray(rawFiles) ? rawFiles : [rawFiles];
}

function toFormat(
  rawFormat: RawSettingsTranslationFilesFormat
): TranslationFilesFormat {
  if (rawFormat in RAW_FORMAT_TO_TRANSLATION_FILES_FORMAT) {
    return RAW_FORMAT_TO_TRANSLATION_FILES_FORMAT[
      rawFormat as keyof typeof RAW_FORMAT_TO_TRANSLATION_FILES_FORMAT
    ];
  }
  throw new Error(`Invalid translation files format: "${rawFormat}"`);
}
