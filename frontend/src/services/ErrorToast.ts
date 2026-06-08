type Listener = (message: string | null) => void;

let currentMessage: string | null = null;
let timeout: ReturnType<typeof setTimeout> | null = null;

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener(currentMessage));
}

export function showError(message: string) {
  currentMessage = message;
  emit();

  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    currentMessage = null;
    emit();
  }, 3000);
}

export function subscribeError(listener: Listener) {
  listeners.add(listener);

  listener(currentMessage);

  return () => {
    listeners.delete(listener);
  };
}