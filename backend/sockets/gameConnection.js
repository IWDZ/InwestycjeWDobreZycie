import { createGame, generateGameCode, getGame, hasGameStarted, isGameFull } from "../exports/utils/gameUtils.js";
import { isValidData, throwError } from "../exports/utils/generalUtils.js";
import { addPlayer, getPlayerGame, hasGamePlayerWithUsername, isPlayerInGame, leaveGame, setPlayerGame } from "../exports/utils/playerUtils.js";
import { ERRORS, MAX_PLAYERS, MIN_PLAYERS } from "../exports/gameStorage.js";
import { io } from "../server.js";

function gameConnection(socket, socketId) {
    socket.on("create_game", (data) => {
        if (getGame(getPlayerGame(socketId))) {
            return throwError(socketId, ERRORS.PLAYER_ALREADY_IN_GAME);
        }

        if (!isValidData(data)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const {username, playersAmount} = data;
        if (typeof username !== "string" || !Number.isInteger(playersAmount) ||
            (playersAmount < MIN_PLAYERS || playersAmount > MAX_PLAYERS)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const gameCode = generateGameCode();

        createGame(gameCode, username, socketId, playersAmount);

        setPlayerGame(socketId, gameCode);
        
        socket.emit("game_created", {
            gameCode: gameCode,
            players: [username]
        })
    });

    socket.on("join_game", (data) => {
        if (!isValidData(data)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const {username, gameCode} = data;
        
        if (typeof username !== "string" || typeof gameCode !== "string") {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        if (isPlayerInGame(socketId)) {
            return throwError(socketId, ERRORS.PLAYER_ALREADY_IN_GAME);
        }

        const game = getGame(gameCode);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        if (hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_ALREADY_STARTED);
        }

        if (isGameFull(game)) {
            return throwError(socketId, ERRORS.GAME_FULL);
        }

        if (hasGamePlayerWithUsername(game, username)) {
            return throwError(socketId, ERRORS.USERNAME_TAKEN);
        }

        addPlayer(game, username, socketId);

        const usernames = game.players.map(player => player.username);

        for (const player of game.players) {
            if (player.socketId === socketId) continue;

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

    socket.on("leave_game", () => leaveGame(socket, socketId));
}

export default gameConnection;