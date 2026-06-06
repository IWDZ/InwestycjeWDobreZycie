import http from 'http';
import { Server } from 'socket.io';
import connectionHandler from './sockets/connectionHandler.js';

const server = http.createServer();

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    connectionHandler(socket);
});

server.listen(3000, () => {
    console.log("Running on 3000");
});