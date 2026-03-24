import { gameConnection } from "./gameConnection.js";

export function handleConnection(socket) {
    console.log("User connected: ", socket.id);

    socket.emit("create_game", {username: "test", playersAmount: 2});

    gameConnection(socket);

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    });
}