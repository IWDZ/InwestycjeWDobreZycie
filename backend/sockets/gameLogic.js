    import Building from "../exports/Building";
    import { getGame } from "../exports/utils";
    import { BUILDINGS, GAMES, MAX_FIELD_SIZE, POPULATION, START_HAPPINESS, START_MONEY } from "../gameStorage";

    function gameLogic(io, socket) {
        socket.on("start_game", data => {
            if (typeof data !== "object" || data === null || Array.isArray(data)) {
                socket.emit("error", "Invalid data");
                return;
            }
            const {gameCode, populationPool, buildingCost, buildMarketVolatility} = data;

            if (typeof gameCode !== "string" || 
                (!Number.isInteger(populationPool) || populationPool < 50 || populationPool > 100) || 
                !Number.isInteger(buildingCost) || !Number.isInteger(buildMarketVolatility)) {
                    socket.emit("error", "Invalid Data");
            }

            const game = getGame(socket, gameCode);
            if (!game) return;

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
                player.field[middle][middle] = new Building(BUILDINGS.TOWN_HALL, game.settings.NEXT_BUILDING_ID, [middle, middle], false);
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
            if (typeof data !== "object" || data === null || Array.isArray(data)) {
                socket.emit("error", "Invalid data");
                return;
            }
            const {gameCode, buildingName, startLocation, isVertical} = data;

            if (typeof gameCode !== "string" || !Array.isArray(startLocation) || 
                !Number.isInteger(startLocation[0]) || startLocation[0] > (MAX_FIELD_SIZE - 1) || startLocation[0] < 0 || 
                !Number.isInteger(startLocation[1]) || startLocation[1] > (MAX_FIELD_SIZE - 1) || startLocation[1] < 0 || typeof isVertical !== "boolean") {
                    socket.emit("error", "Invalid Data");
                    return;
            }

            const building = Object.values(BUILDINGS).find(b => b.name === buildingName);
            if (!building) {
                socket.emit("error", "Building not found");
                return;
            }

            const game = getGame(socket, gameCode);
            if (!game) return;

            const field = game.players.find(p => p.socketId === socket.id).field;
            const columnStart = startLocation[1];
            const rowStart = startLocation[0];

            switch (buildingName) {
                default:
                    const height = isVertical ? building.WIDTH : building.HEIGHT;
                    const width = isVertical ? building.HEIGHT : building.WIDTH;
                    
                    const columnEnd = columnStart + height - 1;
                    const rowEnd = rowStart + width - 1;

                    // TODO: price check

                    for (let y = columnStart; y <= columnEnd; y++) {
                        for (let x = rowStart; x <= rowEnd; x++) {
                            if (field[y][x] !== null) {
                                socket.emit("error", "Space Occupied");
                                return;
                            }
                        }
                    }

                    const id = game.settings.NEXT_BUILDING_ID++;

                    for (let y = columnStart; y <= columnEnd; y++) {
                        for (let x = rowStart; x <= rowEnd; x++) {
                            field[y][x] = new Building(id, building, [columnStart, rowStart], isVertical);
                        }
                    }
                    break;
            }

            socket.emit("field_update", field);
        });

        socket.on("delete_building", data => {
            if (typeof data !== "object" || data === null || Array.isArray(data)) {
                socket.emit("error", "Invalid data");
                return;
            }
            const {gameCode, location} = data;

            if (typeof gameCode !== "string" || !Array.isArray(location)) {
                socket.emit("error", "Invalid Data");
                return;
            }

            const [x, y] = location;
            if (!Number.isInteger(x) || !Number.isInteger(y)) {
                socket.emit("error", "Invalid Data");
                return;
            }

            const game = getGame(socket, gameCode);
            if (!game) return;
            
            const field = game.players.find(p => p.socketId === socket.id).field;
            const buildingObject = field[y][x];

            const { id, building, startLocation, isVertical } = buildingObject;

            if (!buildingObject) {
                socket.emit("error", "Not a building");
                return;
            }
            if (building.NAME === BUILDINGS.TOWN_HALL.NAME) {
                socket.emit("error", "Cannot Delete The Town Hall");
                return;
            }

            const columnStart = startLocation[1];
            const rowStart = startLocation[0];

            const height = isVertical ? building.WIDTH : building.HEIGHT;
            const width = isVertical ? building.HEIGHT : building.WIDTH;
            
            const columnEnd = columnStart + height - 1;
            const rowEnd = rowStart + width - 1;

            for (let y = columnStart; y <= columnEnd; y++) {
                for (let x = rowStart; x <= rowEnd; x++) {
                    if (field[y][x] !== buildingObject) {
                        socket.emit("error", "Something Went Wrong With Deleting A Building");
                        return;
                    }
                    field[y][x] = null;
                }
            }

            socket.emit("field_update", field);
        });
    }

    export default gameLogic;