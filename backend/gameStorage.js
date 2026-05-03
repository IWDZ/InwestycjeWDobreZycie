export const GAMES = new Map();
export const GAME_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPRSTUWVXYZabcdefghijklmnoprstuwvxyz1234567890";
export const GAME_CODE_LENGTH = 6;
export const MAX_PLAYERS = 6;
export const MAX_FIELD_SIZE = 7;
export const POPULATION = 300;
export const START_MONEY = 5000;
export const START_HAPPINESS = 50;

// TODO add money costs
export const BUILDINGS = {
    TOWN_HALL: setBuilding("town_hall", BUILDING_TYPES.SPECIAL, 1, 1, 5, 5, 0, null, null),
    AIRPORT: setBuilding("airport", BUILDING_TYPES.SPECIAL, 2, 3, 0, 10, 4, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.CONCRETE]: 10
    }),
    PORT: setBuilding("port", BUILDING_TYPES.SPECIAL, 1, 2, 0, 8, 1, null, {
        [MATERIALS.WOOD]: 10,
        [MATERIALS.STEEL]: 10
    }),
    PLAYGROUND: setBuilding("playground", BUILDING_TYPES.RECREATIONAL, 1, 1, 0, 0, 1, null, {[MATERIALS.WOOD]: 10}),
    PARK: setBuilding("park", BUILDING_TYPES.RECREATIONAL, 1, 1, 0, 0, 2, null, {
        [MATERIALS.WOOD]: 10
    }),
    CHURCH: setBuilding("church", BUILDING_TYPES.RECREATIONAL, 1, 1, 0, 0, 2, null, {
        [MATERIALS.STONE]: 10,
        [MATERIALS.WOOD]: 10
    }),
    POLICE_STATION: setBuilding("police_station", BUILDING_TYPES.RECREATIONAL, 1, 1, 0, 4, 1, null, {
        [MATERIALS.STEEL]: 10
    }),
    HOSPITAL: setBuilding("hospital", BUILDING_TYPES.RECREATIONAL, 1, 1, 0, 8, 3, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.CONCRETE]: 10
    }),
    SCHOOL: setBuilding("school", BUILDING_TYPES.RECREATIONAL, 1, 1, 0, 5, 2, null, {
        [MATERIALS.WOOD]: 10,
        [MATERIALS.STEEL]: 10
    }),
    UNIVERSITY: setBuilding("university", BUILDING_TYPES.RECREATIONAL, 2, 2, 0, 12, 3, BUILDINGS.SCHOOL, {
        [MATERIALS.CONCRETE]: 10,
        [MATERIALS.GLASS]: 10
    }),
    STADIUM: setBuilding("stadium", BUILDING_TYPES.RECREATIONAL, 2, 3, 0, 15, 5, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.CONCRETE]: 10,
        [MATERIALS.GLASS]: 10
    }),
    MARKET: setBuilding("market", BUILDING_TYPES.COMMERCIAL, 1, 1, 0, 2, 1, null, {
        [MATERIALS.WOOD]: 10
    }),
    GROCERY_STORE: setBuilding("grocery_store", BUILDING_TYPES.COMMERCIAL, 1, 1, 0, 3, 2, null, {
        [MATERIALS.STEEL]: 10
    }),
    SHOPPING_CENTER: setBuilding("shopping_center", BUILDING_TYPES.COMMERCIAL, 2, 2, 0, 10, 3, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.GLASS]: 10
    }),
    BANK: setBuilding("bank", BUILDING_TYPES.COMMERCIAL, 1, 1, 0, 5, 0, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.GLASS]: 10
    }),
    BASIC_OFFICE: setBuilding("basic_office", BUILDING_TYPES.OFFICE, 1, 1, 0, 5, 0, null, {
        [MATERIALS.STEEL]: 10
    }),
    CORPORATE_OFFICE: setBuilding("corporate_office", BUILDING_TYPES.OFFICE, 1, 1, 0, 8, 0, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.GLASS]: 10
    }),
    SKYSCRAPER: setBuilding("skyscraper", BUILDING_TYPES.OFFICE, 1, 1, 0, 12, 0, null, {
        [MATERIALS.CONCRETE]: 10,
        [MATERIALS.GLASS]: 10
    }),
    FACTORY: setBuilding("factory", BUILDING_TYPES.INDUSTRIAL, 2, 1, 0, 8, -1, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.CONCRETE]: 10
    }),
    COAL_PLANT: setBuilding("coal_plant", BUILDING_TYPES.INDUSTRIAL, 2, 1, 0, 6, -2, null, {
        [MATERIALS.STEEL]: 10,
        [MATERIALS.COAL]: 10
    }),
    NUCLEAR_REACTOR: setBuilding("nuclear_reactor", BUILDING_TYPES.INDUSTRIAL, 2, 1, 0, 10, -1, BUILDINGS.COAL_PLANT, {
        [MATERIALS.CONCRETE]: 10,
        [MATERIALS.URANIUM]: 10
    }),
    WOODEN_HOUSE: setBuilding("wooden_house", BUILDING_TYPES.RESIDENTIAL, 1, 1, 2, 0, 0, null, {
        [MATERIALS.WOOD]: 10
    }),
    STONE_HOUSE: setBuilding("stone_house", BUILDING_TYPES.RESIDENTIAL, 1, 1, 3, 0, 0, null, {
        [MATERIALS.STONE]: 10
    }),
    CONCRETE_HOUSE: setBuilding("concrete_house", BUILDING_TYPES.RESIDENTIAL, 1, 1, 5, 0, 0, null, {
        [MATERIALS.CONCRETE]: 10
    }),
    SOVIET_BLOCK: setBuilding("soviet_block", BUILDING_TYPES.RESIDENTIAL, 1, 1, 6, 0, -2, null, {
        [MATERIALS.CONCRETE]: 10
    }),
    APARTMENT_BLOCK: setBuilding("apartment_block", BUILDING_TYPES.RESIDENTIAL, 1, 1, 10, 0, 0, null, {
        [MATERIALS.CONCRETE]: 10,
        [MATERIALS.STEEL]: 10
    }),
    PENTHOUSE: setBuilding("penthouse", BUILDING_TYPES.RESIDENTIAL, 1, 1, 15, 0, 2, null, {
        [MATERIALS.GLASS]: 10,
        [MATERIALS.STEEL]: 10
    }),
}

export const BUILDING_TYPES = {
    SPECIAL: "Special",
    RECREATIONAL: "Rekreacyjne",
    COMMERCIAL: "Commercial",
    OFFICE: "Office",
    INDUSTRIAL: "Industrial",
    RESIDENTIAL: "Residential"
}

export const MATERIALS = {
    STEEL: "steel",
    CONCRETE: "concrete",
    WOOD: "wood",
    STONE: "stone",
    GLASS: "glass",
    COAL: "coal",
    URANIUM: "uranium"
}

function setBuilding(name, type, width, height, apartments_amount, jobs_amount, happiness, requires, moneyCost, materialCost) {
    return {
        NAME: name,
        TYPE: type,
        WIDTH: width,
        HEIGHT: height,
        APARTMENTS: apartments_amount,
        JOBS: jobs_amount,
        HAPPINESS: happiness,
        REQUIRES: requires,
        MONEY_COSt: moneyCost,
        MATERIAL_COST: materialCost
    };
}