import { Server } from "socket.io";
import { serverSettings } from "./server.config.js";

export const io = new Server(serverSettings);