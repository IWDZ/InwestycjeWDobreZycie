import { Socket } from "socket.io";
import SERVER_EVENTS from "../../../../shared/dist/events/server-events.js";
import { handleCreateLobby } from "../handlers/lobby/create-lobby-handler.js";
import { handleJoinLobby } from "../handlers/lobby/join-lobby-handler.js";

export default function registerLobbyHandlers(socket: Socket) {
    socket.on(SERVER_EVENTS.CREATE_LOBBY, (data) => handleCreateLobby(socket, data));
    socket.on(SERVER_EVENTS.JOIN_LOBBY, (data) =>  handleJoinLobby(socket, data));
}