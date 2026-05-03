import leaveGame from "../exports/leaveGame.js";
import { GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAMES, MAX_PLAYERS } from "../gameStorage.js";

function gameConnection(io, socket) {

    socket.on("create_game", (data) => {
        if (typeof data !== "object" || data === null || Array.isArray(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {username, playersAmount} = data;
        if (typeof username !== "string" || !Number.isInteger(playersAmount) ||
            (playersAmount < 2 || playersAmount > MAX_PLAYERS)) {
            socket.emit("error", "Invalid data");
            return;
        }

        let gameCode = "";
        while (gameCode === ""){
            for (let i = 0; i < GAME_CODE_LENGTH; i++) {
                gameCode += GAME_CODE_CHARACTERS[Math.floor(Math.random() * GAME_CODE_CHARACTERS.length)];
            }
            if (GAMES.has(gameCode)) gameCode = "";
        }

        GAMES.set(gameCode,
            {
                host: {
                    username: username,
                    socketId: socket.id
                },
                players: [
                    {
                        username: username,
                        socketId: socket.id
                    }
                ],
                maxPlayers: playersAmount,
                started: false
            }
        );
        console.log(`Game created with code "${gameCode}": \n${GAMES.get(gameCode)}`);
        socket.emit("game_created", {
            gameCode: gameCode,
            players: [username]
        })
    });

    socket.on("join_game", (data) => {
        if (typeof data !== "object" || data === null || Array.isArray(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {username, gameCode} = data;
        if (typeof username !== "string" || typeof gameCode !== "string") {
            socket.emit("error", "Invalid data");
            return;
        }

        let game = [...GAMES.values()].find(game => game.players.some(player => player.socketId === socket.id));
        if (game) {
            socket.emit("error", "Player already in a game");
            return;
        }

        const game = getGame(socket, gameCode);
        if (!game) return;
        
        const players = game.players;

        if (players.length >= game.maxPlayers) {
            socket.emit("error", "The game is full");
            return;
        }

        if (game.started) {
            socket.emit("error", "Game already started");
            return;
        }
        
        const sameUsernamePlayer = players.some(player => player.username === username);
        if (sameUsernamePlayer) {
            socket.emit("error", "User with this username is already in this game")
            return;
        }

        players.push({
            username: username,
            socketId: socket.id
        });

        const usernames = players.map(player => player.username);

        players.forEach(player => {
            if (player.socketId === socket.id) return;

            io.to(player.socketId).emit("player_joined", {
                players: usernames
            });
        });

        socket.emit("joined", {
            host: game.host,
            gameCode: gameCode,
            players: usernames
        });
    });

    socket.on("leave_game", gameCode => {
        leaveGame(io, socket, gameCode);
    });
}

export default gameConnection;