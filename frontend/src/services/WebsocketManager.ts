import { io, Socket } from "socket.io-client";
import { Err, Ok, Result } from "./Utilities";
import { loadingScreen } from "../components/LoadingScreen";

const HOST = "localhost";
const PORT = 3000;

type Handler<T = any> = (data: T) => void;

export class WebsocketManager {
  socket: Socket;
  private connected: boolean = false;
  private handlers: Map<string, Handler[]> = new Map();
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.socket = io(`http://${HOST}:${PORT}`, {
      autoConnect: false,
      reconnection: false,
    });

    this.socket.on("connect", () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log("Connected to websocket successfully.");
      loadingScreen.current?.hide();
    });

    this.socket.on("disconnect", (reason) => {
      this.connected = false;
      console.warn("Disconnected from websocket, reason: ", reason);
      if (reason !== "io client disconnect") {
        this.scheduleReconnect();
      }
    });

    this.socket.on("connect_error", (err) => {
      console.error("Websocket connection error:", err.message);
      this.scheduleReconnect();
    });
  }

  private scheduleReconnect() {
    loadingScreen.current?.showLoading();

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Websocket connection error: Max attempts reached");
      loadingScreen.current?.showError();
      return;
    }
    if (this.reconnectTimer) return;

    const delay = Math.min(500 * (this.reconnectAttempts + 1), 10000);
    this.reconnectAttempts++;
    console.log(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`,
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.socket.connect();
    }, delay);
  }

  public connect() {
    this.reconnectAttempts = 0;
    this.socket.connect();
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket.disconnect();
  }

  public register_handler<T>(event: string, handler: Handler<T>) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
      this.socket.on(event, (data: T) => {
        this.handlers.get(event)?.forEach((h) => h(data));
      });
    }
    this.handlers.get(event)!.push(handler as Handler);
  }

  public unregister_handler<T>(event: string, handler: Handler<T>) {
    const list = this.handlers.get(event);
    if (!list) return;
    const filtered = list.filter((h) => h !== handler);
    if (filtered.length === 0) {
      this.handlers.delete(event);
      this.socket.off(event);
    } else {
      this.handlers.set(event, filtered);
    }
  }

  public request<TReq, TRes>(
    event: string,
    responseEvent: string,
    data: TReq,
  ): Promise<Result<TRes>> {
    if (!this.connected) this.connect();
    return new Promise((resolve) => {
      const cleanup = () => {
        clearTimeout(timeout);
        this.socket.off("error", onError);
        this.socket.off(responseEvent, onResponse);
      };
      const onError = (msg: string) => {
        cleanup();
        resolve(Err(msg));
      };
      const onResponse = (response: TRes) => {
        cleanup();
        resolve(Ok(response));
      };
      const timeout = setTimeout(() => {
        cleanup();
        console.error("Websocket timeout for event:", event);
        resolve(Err(`Nie można połączyć się z serwerem.`));
      }, 7600);
      this.socket.once("error", onError);
      this.socket.once(responseEvent, onResponse);
      this.socket.emit(event, data);
    });
  }

  public notify<T>(event: string, data: T) {
    if (!this.connected) this.connect();
    this.socket.emit(event, data);
  }

  public isConnected() {
    return this.connected;
  }
}

export const ws = new WebsocketManager();
