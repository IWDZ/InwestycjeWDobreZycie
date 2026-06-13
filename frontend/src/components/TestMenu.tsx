import { createPortal } from "react-dom";
import { ws } from "../services/WebsocketManager";
import "../style/testMenu.css";

export default function TestMenu() {
    return createPortal(
         <div className="testMenu">
            <h1 className="menuText">Debug Menu</h1>
            <button className="menuOption" onClick={() => ws.notify("tick", undefined)}>
                ProgressTick
            </button>
        </div>,
        document.body
    );
}