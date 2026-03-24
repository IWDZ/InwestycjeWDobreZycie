import http from 'http';
import { Server } from 'socket.io';
import { handleConnection } from './sockets/handler.js';

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    handleConnection(socket);
});

server.listen(3000, () => {
    console.log("Running on 3000");
});