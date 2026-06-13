import { useSyncExternalStore } from "react";

export function useLocale() {
  useSyncExternalStore(
    cb => locale.subscribe(cb),
    () => locale.strings
  );
  return locale;
}

import { en } from "./strings/en";
import { pl } from "./strings/pl";
import { jp } from "./strings/jp";

export type LocaleName = "en" | "pl" | "jp";

const localeMap: Record<LocaleName, Record<string, string>> = { en, pl, jp };

type Listener = () => void;

class Locale {
  strings: Record<string, string> = en;
  private listeners: Set<Listener> = new Set();

  setLocale(name: LocaleName) {
    this.load(localeMap[name]);
  }

  load(strings: Record<string, string>) {
    this.strings = strings;
    this.listeners.forEach(l => l());
  }

  t(key: string, ...args: (string | number)[]): string {
    const str = this.strings[key] ?? key;
    return str.replace(/{(\d+)}/g, (_, i) => String(args[i] ?? ""));
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const locale = new Locale();