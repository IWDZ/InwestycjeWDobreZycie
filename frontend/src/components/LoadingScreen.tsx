import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export interface LoadingScreenRef {
  showLoading: () => void;
  showError: () => void;
  hide: () => void;
}

export interface LoadingScreenProps {
  onClick: () => void;
}

export const loadingScreen = { current: null as LoadingScreenRef | null };

export const LoadingScreen = forwardRef<LoadingScreenRef, LoadingScreenProps>(({onClick}, ref) => {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState("Łączenie z serwerem...");
  const [dots, setDots] = useState("");

  useImperativeHandle(ref, () => ({
    showLoading: () => {
      setMessage("Łączenie z serwerem...");
      setState("loading");
      setVisible(true);
    },
    showError: () => {
      setState("error");
      setVisible(true);
    },
    hide: () => setVisible(false),
  }));

  useEffect(() => {
    if (state !== "loading" || !visible) return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(t);
  }, [state, visible]);

  if (!visible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-card">
        {state === "loading" ? (
          <>
            <div className="loading-spinner">
              <div className="loading-spinner-ring" />
              <div className="loading-spinner-ring loading-spinner-ring--2" />
            </div>
            <p className="loading-message">{message}<span className="loading-dots">{dots}</span></p>
          </>
        ) : (
          <>
            <div className="loading-error-icon">✕</div>
            <h2 className="loading-error-title">Błąd połączenia</h2>
            <p className="loading-message">Nie udało się połączyć z serwerem.</p>
              <button className="loading-back-btn" onClick={() => {
                onClick()
                setVisible(false)
              }}>
              Wróć do lobby
            </button>
          </>
        )}
      </div>
    </div>
  );
});