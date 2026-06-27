export const standardGameRules: GameRules = {
    marketVolatility: 0,
    gameDuration: 0,
    defaultMaterialPrices: undefined,
    populationPool: 0
}

export interface GameRules {
    marketVolatility: number;
    gameDuration: number;
    defaultMaterialPrices: unknown;
    populationPool: number;
}