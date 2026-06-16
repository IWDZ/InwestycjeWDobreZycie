import { en } from "./strings/en";
import { pl } from "./strings/pl";
import { jp } from "./strings/jp";

export const localeMap = {
  en,
  pl,
  jp,
} as const;

export type LocaleName = keyof typeof localeMap;

export const LANGUAGES: Array<{ code: LocaleName; label: string }> = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "jp", label: "日本語" },
];