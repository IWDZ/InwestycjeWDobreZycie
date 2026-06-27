import http from "http";
import { io } from "./config/server/socket.config.js";
import { PORT } from "./config/server/server.config.js";
import registerSockets from "./sockets/register-sockets.js";

const server = http.createServer();

io.attach(server);

registerSockets();

server.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});