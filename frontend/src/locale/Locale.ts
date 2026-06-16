import { ClientSettings } from "../services/ClientSettings";
import { useSyncExternalStore } from "react";
import { localeMap } from "./locale.config";

const settings = ClientSettings.getInstance();

class Locale {
  get name() {
    return settings.locale;
  }

  get strings() {
    return localeMap[settings.locale];
  }

  t(key: string, ...args: (string | number)[]) {
    const str = this.strings[key] ?? key;
    return str.replace(/{(\d+)}/g, (_, i) => String(args[i] ?? ""));
  }
}

export function useLocale() {
  useSyncExternalStore(
    cb => settings.subscribe(cb),
    () => settings.locale
  );

  return locale;
}

export const locale = new Locale();

