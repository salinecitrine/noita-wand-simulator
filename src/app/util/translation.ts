import { translations } from '../calc/__generated__/translations';

export function t(key: string) {
  key = key.replace(/^\$/, '');
  if (hasTranslationKey(key)) {
    return translations[key];
  } else {
    throw Error(`missing translation key: ${key}`);
  }
}

export function hasTranslationKey(
  key: string,
): key is keyof typeof translations {
  return translations.hasOwnProperty(key);
}
