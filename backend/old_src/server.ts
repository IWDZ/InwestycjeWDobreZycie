import http from "http";
import { io } from "./config/socket.js";
import connectionHandler from "./sockets/connectionHandler.js";

const server = http.createServer();

io.attach(server);

connectionHandler();

const PORT = 3000;
server.listen(PORT, () => {
    console.log("Running on ${PORT}");
});