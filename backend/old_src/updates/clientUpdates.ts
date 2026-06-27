import { Game, GameMatch } from "../config/games.js";
import { Player } from "../config/players.js";
import { io } from "../config/socket.js";
import { getHappiness, sumUpPlayers } from "../utils/playerUtils.js";

export function sendFieldUpdate(player: Player) {
    io.to(player.socketId).emit("field_update", player.field);
}

export function sendCellPriceUpdate(player: Player) {
    io.to(player.socketId).emit("cell_price_update", player.nextCellPrice);
}

export function sendHappinessUpdate(player: Player) {
    io.to(player.socketId).emit("happiness_update", getHappiness(player));
}

export function sendMaterialsUpdate(player: Player) {
    io.to(player.socketId).emit("materials_update", player.materials);
}

export function sendMoneyUpdate(player: Player) {
    io.to(player.socketId).emit("money_update", player.money);
}

export function sendMaterialPricesUpdate(game: GameMatch) {
    for (const player of game.players) {
        io.to(player.socketId).emit("material_prices_update", game.materialPrices);
    }
}

export function sendPopulationUpdate(game: GameMatch) {
    for (const player of game.players) {
        io.to(player.socketId).emit("population_update", {
            jobSpaces: player.jobSpaces,
            apartmentSpaces: player.apartmentSpaces,
            population: player.population,
            populationPool: game.populationPool
        });
    }
}

export function sendCapacityUpdate(player: Player) {
    io.to(player.socketId).emit("capacity_update", {
        jobSpaces: player.jobSpaces,
        apartmentSpaces: player.apartmentSpaces
    });
}

export function sendMoneyIncrease(player: Player, amount: number) {
    io.to(player.socketId).emit("money_increase", amount);
}

export function sendMoneyDecrease(player: Player, amount: number) {
    io.to(player.socketId).emit("money_decrease", amount);
}

export function sendTickNumberUpdate(player: Player, tickNumber: number) {
    io.to(player.socketId).emit("tick_update", tickNumber);
}

export function sendLeaderboardUpdate(game: GameMatch) {
    for (const player of game.players) {
        io.to(player.socketId).emit("leaderboard_update", sumUpPlayers(game));
    }
}