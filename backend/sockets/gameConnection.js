import { gameCodeCharacters, gameCodeLength, games, maxPlayers } from "../gameStorage.js";

export function gameConnection(socket) {

    socket.on("create_game", (data) => {
        const [username, playersAmount] = data;
        if (typeof username !== "string" || typeof playersAmount !== "number" ||
            (playersAmount < 2 || playersAmount > maxPlayers)) {
            socket.emit("error", "Invalid data");
            return;
        }

        let gameCode = "";
        while (gameCode === ""){
            for (let i = 0; i < gameCodeLength; i++) {
                gameCode += gameCodeCharacters[Math.floor(Math.random() * gameCodeCharacters.length)];
            }
            if (games.has(gameCode)) gameCode = "";
        }

        games.set(gameCode,
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
        console.log(`Game created with code "${gameCode}": \n${games.get(gameCode)}`);
        socket.emit("game_created", {
            gameCode: gameCode,
            players: [username]
        })
    });

    socket.on("join_game", (data) => {
        const [username, gameCode] = data;
        if (typeof username !== "string" || typeof gameCode !== "string") {
            socket.emit("error", "Invalid data");
            return;
        }

        if (!games.has(gameCode)) {
            socket.emit("error", "Game Not Found");
            return;
        }

        let game = [...games.values()].find(game => game.players.some(player => player.socketId === socket.id));
        if (game) {
            socket.emit("error", "Player already in a game");
            return;
        }

        game = games.get(gameCode);
        
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
        if (typeof gameCode !== "string") {
            socket.emit("error", "Invalid data");
            return;
        }

        if (!games.has(gameCode)) {
            socket.emit("error", "Game Not Found");
            return;
        }

        const game = games.get(gameCode);
        const isPlayerInGame = game.players.some(player => player.socketId === socket.id);
        if (!isPlayerInGame) {
            socket.emit("error", "Player not in the game");
            return;
        }

        if (game.host.socketId === socket.id && !game.started) {
            socket.emit("left");
            games.players.forEach(player => io.to(player.socketId).emit("host_left"));
            games.delete(gameCode);
            return;
        }

        game.players = game.players.filter(player => player.socketId !== socket.id);

        const usernames = game.players.map(player => player.username);

        games.players.forEach(player => {
            io.to(player.socketId).emit("player_left", {
                players: usernames
            });
        });

        socket.emit("left");
    });
}