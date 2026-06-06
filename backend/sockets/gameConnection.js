import leaveGame from "../exports/leaveGame.js";
import { generateGameCode, getDefaultGameObject, getGame, hasGameStarted, hasPlayer, hasPlayerWithUsername, isGameFull, isHost, isPlayerInGame, isValidData, removePlayer, throwError } from "../exports/utils.js";
import { ERRORS, GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAMES, MAX_PLAYERS, MIN_PLAYERS } from "../gameStorage.js";
import { io } from "../server.js";

function gameConnection(socket) {
    socket.on("create_game", (data) => {
        if (isPlayerInGame(socket.id)) {
            return throwError(socket.id, ERRORS.PLAYER_ALREADY_IN_GAME);
        }
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }
        const {username, playersAmount} = data;
        if (typeof username !== "string" || !Number.isInteger(playersAmount) ||
            (playersAmount < MIN_PLAYERS || playersAmount > MAX_PLAYERS)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        let gameCode = generateGameCode();

        GAMES.set(gameCode, getDefaultGameObject(gameCode, username, socket.id, playersAmount));
        
        socket.emit("game_created", {
            gameCode: gameCode,
            players: [username]
        })
    });

    socket.on("join_game", (data) => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const {username, gameCode} = data;
        
        if (typeof username !== "string" || typeof gameCode !== "string") {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        if (isPlayerInGame(socket.id)) {
            return throwError(socket.id, ERRORS.PLAYER_ALREADY_IN_GAME);
        }

        const game = getGame(socket, gameCode);
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_ALREADY_STARTED);
        }

        if (isGameFull(game)) {
            return throwError(socket.id, ERRORS.GAME_FULL);
        }

        if (hasPlayerWithUsername(game, username)) {
            return throwError(socket.id, ERRORS.USERNAME_TAKEN);
        }

        game.players.push({
            username: username,
            socketId: socket.id
        });

        const usernames = game.players.map(player => player.username);

        for (const player of game.players) {
            if (player.socketId === socket.id) continue;

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
        leaveGame(socket, gameCode);
    });
}

export default gameConnection;