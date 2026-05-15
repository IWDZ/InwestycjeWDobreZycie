import leaveGame from "../exports/leaveGame.js";
import { generateGameCode, getDefaultGameObject, hasGameStarted, hasPlayer, hasPlayerWithUsername, isGameFull, isHost, isPlayerInGame, isValidData, removePlayer } from "../exports/utils.js";
import { GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAMES, MAX_PLAYERS } from "../gameStorage.js";

function gameConnection(io, socket) {
    socket.on("create_game", (data) => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {username, playersAmount} = data;
        if (typeof username !== "string" || !Number.isInteger(playersAmount) ||
            (playersAmount < 2 || playersAmount > MAX_PLAYERS)) {
            socket.emit("error", "Invalid data");
            return;
        }

        let gameCode = generateGameCode();

        GAMES.set(gameCode, getDefaultGameObject(username, socket.id, playersAmount));
        
        socket.emit("game_created", {
            gameCode: gameCode,
            players: [username]
        })
    });

    socket.on("join_game", (data) => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {username, gameCode} = data;
        if (typeof username !== "string" || typeof gameCode !== "string") {
            socket.emit("error", "Invalid data");
            return;
        }

        if (isPlayerInGame(socket.id)) {
            socket.emit("error", "Player already in a game");
            return;
        }

        const game = getGame(socket, gameCode);
        if (!game) return;
        
        if (hasGameStarted(game)) {
            socket.emit("error", "Game already started");
            return;
        }

        if (isGameFull(game)) {
            socket.emit("error", "The game is full");
            return;
        }

        if (hasPlayerWithUsername(game, username)) {
            socket.emit("error", "User with this username is already in this game")
            return;
        }

        game.players.push({
            username: username,
            socketId: socket.id
        });

        const usernames = game.players.map(player => player.username);

        for (const player of game.players) {
            if (player.socketId === socket.id) return;

            io.to(player.socketId).emit("player_joined", {
                players: usernames
            });
        }

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