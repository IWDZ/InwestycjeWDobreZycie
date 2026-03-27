import http from 'http';
import { Server } from 'socket.io';
import connectionHandler from './sockets/connectionHandler.js';

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    connectionHandler(io, socket);
});

server.listen(3000, () => {
    console.log("Running on 3000");
});