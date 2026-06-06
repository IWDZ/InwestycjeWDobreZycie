import { CELL_PRICE_INCREASE } from "../gameStorage.js";

export function sendFieldUpdate(io, player) {
    io.to(player.socketId).emit("field_update", player.field);
}

export function sendCellPriceUpdate(io, player) {
    io.to(player.socketId).emit("cell_price_update", player.nextCellPrice - CELL_PRICE_INCREASE);
}

export function sendHappinessUpdate(io, player) {
    io.to(player.socketId).emit("happiness_update", player.happiness);
}

export function sendMaterialsUpdate(io, player) {
    io.to(player.socketId).emit("materials_update", player.materials);
}

export function sendMoneyUpdate(io, player) {
    io.to(player.socketId).emit("money_update", player.money);
}

export function sendMaterialPricesUpdate(io, game) {
    for (const player of game.players) {
        io.to(player.socketId).emit("material_prices_update", game.materialPrices);
    }
}

export function sendPopulationUpdate(io, game) {
    for (const player of game.players) {
        io.to(player.socketId).emit("population_update", {
            jobs: player.maxWorkingPopulation,
            residences: player.maxLivingPopulation,
            population: player.workingPopulation,
            populationPool: game.settings.POPULATION
        });
    }
}

export function sendMaxPopulationUpdate(io, player) {
    io.to(player.socketId).emit("max_population_update", {
        jobs: player.maxWorkingPopulation,
        residences: player.maxLivingPopulation
    });
}

export function sendMoneyIncrease(io, player, amount) {
    io.to(player.socketId).emit("money_increase", amount);
}

export function sendMoneyDecrease(io, player, amount) {
    io.to(player.socketId).emit("money_decrease", amount);
}