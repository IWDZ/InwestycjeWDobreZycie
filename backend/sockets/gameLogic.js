    import Building from "../exports/Building";
    import { BUILDINGS, GAMES, MAX_FIELD_SIZE, POPULATION, START_HAPPINESS, START_MONEY } from "../gameStorage";

    function gameLogic(io, socket) {
        socket.on("start_game", data => {
            if (typeof data !== "object") {
                socket.emit("error", "Invalid data");
                return;
            }
            const {gameCode, populationPool, buildingCost, buildMarketVolatility} = data;

            if (typeof gameCode !== "string" || 
                (typeof populationPool !== "number" || populationPool < 50 || populationPool > 100) || 
                typeof buildingCost !== "number" || typeof buildMarketVolatility !== "number") {
                    socket.emit("error", "Invalid Data");
            }

            const game = GAMES.get(gameCode);
            if(!game) {
                socket.emit("error", "Game Not Found");
                return;
            }
            game.started = true;
            game.settings = {
                POPULATION: ((populationPool / 100) * POPULATION),
                BUILDING_COST: buildingCost,
                BUILD_MARKET_VOLATILITY: buildMarketVolatility,
                NEXT_BUILDING_ID: 1
            };

            if (game.host.socketId !== socket.id) {
                socket.emit("error", "Access Denied");
                return;
            }

            game.players.forEach(player => {
                player.field = Array.from({ length: MAX_FIELD_SIZE }, () => Array(MAX_FIELD_SIZE));
                const middle = Math.floor(MAX_FIELD_SIZE / 2);
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        player.field[middle+i][middle+j] = null;
                    }
                }
                player.field[middle][middle] = new Building(BUILDINGS.TOWN_HALL, game.settings.NEXT_BUILDING_ID);
                player.happiness = START_HAPPINESS;
                player.money = START_MONEY;
                game.settings.NEXT_BUILDING_ID++;
            });

            game.players.forEach(player => {
                io.to(player.socketId).emit("game_start", {
                    population: game.settings.POPULATION,
                    money: player.money,
                    happiness: player.happiness,
                    field: player.field,
                    buildings: BUILDINGS
                });
            });
        });

        socket.on("create_building", data => {
            if (typeof data !== "object") {
                socket.emit("error", "Invalid data");
                return;
            }
            const {gameCode, startLocation, isVertical} = data;

            if (typeof gameCode !== "string" || typeof startLocation !== "object" || 
                typeof startLocation[0] !== "number" || startLocation[0] > 7 || startLocation[1] < 0 || 
                typeof startLocation[1] !== "number" || startLocation[1] > 7 || startLocation[1] < 0 || typeof isVertical !== "boolean") {
                    socket.emit("error", "Invalid Data");
            }

            const game = GAMES.get(gameCode);
            if(!game) {
                socket.emit("error", "Game Not Found");
                return;
            }

            
        });
    }

    export default gameLogic;