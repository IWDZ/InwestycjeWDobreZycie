import { soundManager } from "./SoundManager";
import { locale } from "../locale/Locale"

type NotifType = "error" | "info";
type Listener = (list: Notification[]) => void;

export type Notification = {
  id: number;
  type: NotifType;
  message: string;
};

let notifs: Notification[] = [];
let globalNotifCounter = 1;

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener([...notifs]));
}

export function showInfo(message: string) {
  show(message, "info");
}

export function showError(code: string) {
  const msg = locale.t(`error.${code}`) ?? code;
  show(msg, "error")
}

function show(message: string, type: NotifType) {
  const id = globalNotifCounter;
  notifs.push({
    id,
    message,
    type,
  });
  globalNotifCounter++;
  soundManager.play("warning")
  emit();

  setTimeout(() => {
    removeMessage(id);
  }, 3000);
}

function removeMessage(id: number) {
  notifs = notifs.filter((s) => s.id != id);
  emit();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);

  listener(notifs);

  return () => {
    listeners.delete(listener);
  }
}