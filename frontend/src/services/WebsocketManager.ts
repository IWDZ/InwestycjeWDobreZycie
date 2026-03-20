import { io, Socket } from "socket.io-client";
import { Err, Ok, Result } from "./Utilities";

const HOST = "localhost"
const PORT = 3000;

export class WebsocketManager {
    socket: Socket
    private connected: boolean = false;

    constructor() {
        this.socket = io(`http://${HOST}:${PORT}`, {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 500,
        });

        this.socket.on("connect", () => {
            this.connected = true;
        });

        this.socket.on("disconnect", () => {
            this.connected = false;
        });

        this.socket.on("connect_error", (err) => {
            console.error("Connection error:", err.message);
        });
    }

    public connect() {
        this.socket.connect();
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public request<TReq, TRes>(event: string, data: TReq): Promise<Result<TRes>> {
        if (!this.connected) {
            this.connect();
        }
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(Err(`Zbyt długie oczekiwanie: ${event}`));
            }, 5000);

            this.socket.emit(event, data, (response: TRes) => {
                clearTimeout(timeout);
                resolve(Ok(response));
            });
        });
    }

    public notify<T>(event: string, data: T) {
        if (!this.connected) {
            this.connect();
        }
        this.socket.emit(event, data);
    }

    isConnected() {
        return this.connected;
    }
}

export const ws = new WebsocketManager();
