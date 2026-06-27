import { sendMaterialsUpdate, sendMoneyDecrease, sendMoneyIncrease, sendMoneyUpdate } from "../../exports/clientUpdates.js";
import { MATERIAL_SELL_TAX } from "../../exports/gameStorage.js";

export function hasRequiredMaterials(materialCost, materials) {
    return Object.entries(materialCost).every(([material, requiredAmount]) => materials[material] >= requiredAmount);
}

export function hasRequiredMoney(moneyCost, money) {
    return money >= moneyCost;
}

export function buyMaterial(game, player, material, amount) {
    const cost = game.materialPrices[material] * amount;
    if (!hasRequiredMoney(cost, player.money)) {
        return false;
    }

    removeMoney(player, cost);
    addMaterials(player, {[material]: amount});

    sendMoneyDecrease(player, cost);
    sendMoneyUpdate(player);
    sendMaterialsUpdate(player);

    return true;
}

export function sellMaterial(game, player, material, amount) {
    const materialCostObject = {[material]: amount};
    if (!hasRequiredMaterials(materialCostObject, player.materials)) {
        return false;
    }

    removeMaterials(player, materialCostObject);
    const cost = Math.floor(game.materialPrices[material] * amount * (1 - MATERIAL_SELL_TAX));
    addMoney(player, cost);

    sendMoneyIncrease(player, cost);
    sendMoneyUpdate(player);
    sendMaterialsUpdate(player);

    return true;
}

export function returnMaterials(player, materialsToReturn) {
    Object.entries(materialsToReturn).every(([material, amount]) => player.materials[material] += Math.floor(amount / 2));
}

export function addMaterials(player, materialsToAdd) {
    Object.entries(materialsToAdd).forEach(([material, amount]) => player.materials[material] += amount);
}

export function removeMaterials(player, materialsToRemove) {
    Object.entries(materialsToRemove).forEach(([material, requiredAmount]) => player.materials[material] -= requiredAmount);
}

export function returnMoney(player, amount) {
    const moneyToReturn = Math.floor(amount / 2)
    addMoney(player, moneyToReturn);
    return moneyToReturn;
}

export function addMoney(player, amount) {
    player.money += amount;
}

export function removeMoney(player, amount) {
    player.money -= amount;
}