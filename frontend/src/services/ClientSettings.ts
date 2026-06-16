import { LocaleName } from "../locale/locale.config";
type Listener = () => void;

export class ClientSettings {
  private static instance: ClientSettings | null = null;

  private listeners: Set<Listener> = new Set();

  public locale: LocaleName;

  private constructor() {
    const stored = localStorage.getItem("locale") as LocaleName | null;
    this.locale = stored ?? "en";
  }

  public static getInstance(): ClientSettings {
    if (!this.instance) this.instance = new ClientSettings();
    return this.instance;
  }

  setLocale(locale: LocaleName) {
    this.locale = locale;
    localStorage.setItem("locale", locale);
    this.listeners.forEach(l => l());
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}