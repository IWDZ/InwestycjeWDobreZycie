import { CELL_PRICE_INCREASE } from "./gameStorage.js";
import { io } from "../server.js";
import { getHappiness, sumUpPlayers } from "./utils/playerUtils.js";

export function sendFieldUpdate(player) {
    io.to(player.socketId).emit("field_update", player.field);
}

export function sendCellPriceUpdate(player) {
    io.to(player.socketId).emit("cell_price_update", player.nextCellPrice);
}

export function sendHappinessUpdate(player) {
    io.to(player.socketId).emit("happiness_update", getHappiness(player));
}

export function sendMaterialsUpdate(player) {
    io.to(player.socketId).emit("materials_update", player.materials);
}

export function sendMoneyUpdate(player) {
    io.to(player.socketId).emit("money_update", player.money);
}

export function sendMaterialPricesUpdate(game) {
    for (const player of game.players) {
        io.to(player.socketId).emit("material_prices_update", game.materialPrices);
    }
}

export function sendPopulationUpdate(game) {
    for (const player of game.players) {
        io.to(player.socketId).emit("population_update", {
            jobSpaces: player.jobSpaces,
            apartmentSpaces: player.apartmentSpaces,
            population: player.population,
            populationPool: game.populationPool
        });
    }
}

export function sendCapacityUpdate(player) {
    io.to(player.socketId).emit("capacity_update", {
        jobSpaces: player.jobSpaces,
        apartmentSpaces: player.apartmentSpaces
    });
}

export function sendMoneyIncrease(player, amount) {
    io.to(player.socketId).emit("money_increase", amount);
}

export function sendMoneyDecrease(player, amount) {
    io.to(player.socketId).emit("money_decrease", amount);
}

export function sendTickNumberUpdate(player, tickNumber) {
    io.to(player.socketId).emit("tick_update", tickNumber);
}

export function sendLeaderboardUpdate(game) {
    for (const player of game.players) {
        io.to(player.socketId).emit("leaderboard_update", sumUpPlayers(game));
    }
}