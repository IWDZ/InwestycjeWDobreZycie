import { Socket } from "socket.io";
import SERVER_EVENTS from "../../../../shared/dist/events/server-events.js";
import { handleStartGame } from "../handlers/game/start-game-handler.js";

export default function registerGameHandlers(socket: Socket) {
    socket.on(SERVER_EVENTS.START_GAME, () => handleStartGame(socket))
}