import { createGame, generateGameCode, getGame, hasGameStarted, isGameFull } from "../utils/gameUtils.js";
import { throwError } from "../utils/generalUtils.js";
import { addPlayer, getPlayerGame, hasGamePlayerWithUsername, leaveGame, setPlayerGame } from "../utils/playerUtils.js";
import { ERRORS } from "../../../shared/errors/errors.js";
import { io } from "../config/socket.js";
import { Socket } from "socket.io";
import { createGameSchema, joinGameSchema } from "../../../shared/schemas/server-event-schemas.js"
import { GameLobby } from "../config/games.js";

function gameConnection(socket: Socket) {
    socket.on("create_game", (data) => {
        if (getGame(getPlayerGame(socket.id))) {
            return throwError(socket.id, ERRORS.PLAYER_ALREADY_IN_GAME);
        }

        const result = createGameSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const {username, playersAmount} = result.data;

        const gameCode = generateGameCode();

        createGame(gameCode, username, socket.id, playersAmount);

        setPlayerGame(socket.id, gameCode);
        
        socket.emit("game_created", {
            gameCode: gameCode,
            players: [username]
        });
    });

    socket.on("join_game", (data) => {
        const result = joinGameSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const {username, gameCode} = result.data;

        const game = <GameLobby>getGame(gameCode);
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_ALREADY_STARTED);
        }

        if (isGameFull(game)) {
            return throwError(socket.id, ERRORS.GAME_FULL);
        }

        if (hasGamePlayerWithUsername(game, username)) {
            return throwError(socket.id, ERRORS.USERNAME_TAKEN);
        }

        addPlayer(game, username, socket.id);

        const usernames: string[] = game.players.map(player => player.username);

        for (const player of game.players) {
            if (player.socketId === socket.id) continue;

            io.to(player.socketId).emit("player_joined", {
                players: usernames
            });
        }

        socket.emit("joined", {
            host: game.host,
            gameCode: gameCode,
            players: usernames,
            maxPlayers: game.maxPlayers
        });
    });

    socket.on("leave_game", () => leaveGame(socket, socket.id));
}

export default gameConnection;