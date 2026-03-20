import { useState, useImperativeHandle, forwardRef } from "react";

export interface ErrorNotifRef {
    show: (message: string) => void;
}

export const ErrorNotif = forwardRef<ErrorNotifRef>((_, ref) => {
    const [message, setMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        show: (msg: string) => setMessage(msg)
    }));

    if (!message) return null;

    return (
        <>
            <div className="error-backdrop" onClick={() => setMessage(null)} />
            <div className="error-modal">
                <div className="error-modal-header">
                    <p className="error-modal-header-text">Wystąpił błąd</p>
                    <button onClick={() => setMessage(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#A32D2D", fontSize: 18, lineHeight: 1 }}>×</button>
                </div>
                <div className="error-modal-body">
                    <p>{message}</p>
                </div>
                <button className="error-modal-button" onClick={() => setMessage(null)}>OK</button>
            </div></>
    );
});