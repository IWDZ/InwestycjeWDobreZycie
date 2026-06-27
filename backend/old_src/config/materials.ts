export const MARKET_VOLATILITY_MIN = 0.5;
export const MARKET_VOLATILITY_MAX = 5;
export const MARKET_VOLATILITY_DEFAULT = 1;

export const MATERIALS = {
    STEEL: "steel",
    CONCRETE: "concrete",
    WOOD: "wood",
    STONE: "stone",
    GLASS: "glass",
    COAL: "coal",
    URANIUM: "uranium"
} as const;

export const MATERIAL_START_PRICES = {
    [MATERIALS.WOOD]: 10,
    [MATERIALS.STONE]: 15,
    [MATERIALS.COAL]: 20,
    [MATERIALS.CONCRETE]: 25,
    [MATERIALS.STEEL]: 35,
    [MATERIALS.GLASS]: 50,
    [MATERIALS.URANIUM]: 150
} as const satisfies Materials;

export const START_MATERIALS = {
    [MATERIALS.STEEL]: 50,
    [MATERIALS.CONCRETE]: 50,
    [MATERIALS.WOOD]: 50,
    [MATERIALS.STONE]: 50,
    [MATERIALS.GLASS]: 0,
    [MATERIALS.COAL]: 0,
    [MATERIALS.URANIUM]: 0
} as const satisfies Materials;

export const MATERIAL_SELL_TAX = 0.15;

export const MARKET_UPDATE_TICK_INTERVAL = 3;

export type Material = typeof MATERIALS[keyof typeof MATERIALS];

export type Materials = Record<Material, number>;