import { Materials, MATERIALS } from "./materials.js";
import { BUILDINGS, RequiredBuilding } from "./buildings.js";

export const ATOMIC_BOMB = {
    MATERIAL_COST: {
        [MATERIALS.URANIUM]: 750,
        [MATERIALS.STEEL]: 350,
        [MATERIALS.COAL]: 250,
    } satisfies Partial<Materials>,
    MONEY_COST: 50000,
    REQUIRED_BUILDING: BUILDINGS.NUCLEAR_REACTOR.NAME satisfies RequiredBuilding
} as const;