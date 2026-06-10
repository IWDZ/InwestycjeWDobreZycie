import { useState, useImperativeHandle, forwardRef } from "react";
import { soundManager } from "../services/SoundManager";

export interface ErrorNotifRef {
    show: (message: string) => void;
}

export const ErrorNotif = forwardRef<ErrorNotifRef>((_, ref) => {
    const [message, setMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      show: (msg: string) => {
        soundManager.play('warning')
        setMessage(msg)
      },
    }));

    if (!message) return null;

    return (
        <>
            <div className="error-backdrop" onClick={() => setMessage(null)} />
            <div className="error-modal">
                <div className="error-modal-header">
                    <p className="error-modal-header-text">Błąd</p>
                    <button className="error-modal-close" onClick={() => setMessage(null)}>×</button>
                </div>
                <div className="error-modal-body">
                    <p>{message}</p>
                </div>
                <div className="error-modal-footer">
                    <button className="error-modal-button" onClick={() => setMessage(null)}>OK</button>
                </div>
            </div>
        </>
    );
});