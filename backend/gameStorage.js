export const GAMES = new Map();
export const GAME_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPRSTUWVXYZabcdefghijklmnoprstuwvxyz1234567890";
export const GAME_CODE_LENGTH = 6;
export const MAX_PLAYERS = 6;
export const BUILDINGS = {
    TOWN_HALL: setBuilding("town_hall", BUILDING_TYPES.SPECIAL, 5, 5, 0, null, null),
    AIRPORT: setBuilding("airport", BUILDING_TYPES.SPECIAL, 0, 10, 4, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.CONCERETE]: 10
    }),
    PORT: setBuilding("port", BUILDING_TYPES.SPECIAL, 0, 8, 1, null, {
        [MATERIALS.WOOD]: 10,
        [MATERIALS.STEEL]: 10
    }),
    PLAYGROUND: setBuilding("playground", BUILDING_TYPES.RECREATIONAL, 0, 0, 1, null, {[MATERIALS.WOOD]: 10}),
    
}
export const BUILDING_TYPES = {
    SPECIAL: "Special",
    RECREATIONAL: "Rekreacyjne"
}
export const MATERIALS = {
    STEEL: "steel",
    CONCERETE: "concrete",
    WOOD: "wood",
    STONE: "stone",
    GLASS: "glass",
    COAL: "coal",
    URANIUM: "uranium"
}

function setBuilding(name, type, apartments_amount, jobs_amount, happiness, requires, cost) {
    return {
        NAME: name,
        TYPE: type,
        APARTMENTS: apartments_amount,
        JOBS: jobs_amount,
        HAPPINESS: happiness,
        REQUIRES: requires,
        COST: cost
    };
}