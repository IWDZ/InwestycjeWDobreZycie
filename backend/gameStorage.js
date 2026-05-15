/**
  * @typedef {Object} BuildingConfig
  * @property {string} NAME
  * @property {string} TYPE
  * @property {number} WIDTH
  * @property {number} HEIGHT
  * @property {number} APARTMENTS
  * @property {number} JOBS
  * @property {number} HAPPINESS
  * @property {number} MONEY_COST
  * @property {Object<string, number>} MATERIAL_COST
  * @property {string} REQUIRED_BUILDING
  */
export const GAMES = new Map();
export const GAME_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPRSTUWVXYZabcdefghijklmnoprstuwvxyz1234567890";
export const GAME_CODE_LENGTH = 6;
export const MAX_PLAYERS = 6;
export const MAX_FIELD_SIZE = 7;
export const POPULATION = 300;
export const START_MATERIALS = {
    [MATERIALS.STEEL]: 0,
    [MATERIALS.CONCRETE]: 0,
    [MATERIALS.WOOD]: 0,
    [MATERIALS.STONE]: 0,
    [MATERIALS.GLASS]: 0,
    [MATERIALS.COAL]: 0,
    [MATERIALS.URANIUM]: 0
};
export const START_MONEY = 5000;
export const START_HAPPINESS = 50;

export const BUILDING_TYPES = {
    SPECIAL: "Special",
    RECREATIONAL: "Recreational",
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

export const BUILDINGS = {
    TOWN_HALL: setBuilding({
        NAME: "town_hall",
        TYPE: BUILDING_TYPES.SPECIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 5,
        JOBS: 5,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {}
    }),
    AIRPORT: setBuilding({
        NAME: "airport",
        TYPE: BUILDING_TYPES.SPECIAL,
        WIDTH: 2,
        HEIGHT: 3,
        APARTMENTS: 0,
        JOBS: 10,
        HAPPINESS: 4,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.CONCRETE]: 10
        }
    }),
    PORT: setBuilding({
        NAME: "port",
        TYPE: BUILDING_TYPES.SPECIAL,
        WIDTH: 1,
        HEIGHT: 2,
        APARTMENTS: 0,
        JOBS: 8,
        HAPPINESS: 1,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 10,
            [MATERIALS.STEEL]: 10
        }
    }),
    PLAYGROUND: setBuilding({
        NAME: "playground",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 0,
        HAPPINESS: 1,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 10
        }
    }),
    PARK: setBuilding({
        NAME: "park",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 0,
        HAPPINESS: 2,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 10
        }
    }),
    CHURCH: setBuilding({
        NAME: "church",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 0,
        HAPPINESS: 2,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STONE]: 10,
            [MATERIALS.WOOD]: 10
        }
    }),
    POLICE_STATION: setBuilding({
        NAME: "police_station",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 4,
        HAPPINESS: 1,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10
        }
    }),
    HOSPITAL: setBuilding({
        NAME: "hospital",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 8,
        HAPPINESS: 3,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.CONCRETE]: 10
        }
    }),
    SCHOOL: setBuilding({
        NAME: "school",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 5,
        HAPPINESS: 2,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 10,
            [MATERIALS.STEEL]: 10
        }
    }),
    UNIVERSITY: setBuilding({
        NAME: "university",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 2,
        HEIGHT: 2,
        APARTMENTS: 0,
        JOBS: 12,
        HAPPINESS: 3,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 10,
            [MATERIALS.GLASS]: 10
        }
    }),
    STADIUM: setBuilding({
        NAME: "stadium",
        TYPE: BUILDING_TYPES.RECREATIONAL,
        WIDTH: 2,
        HEIGHT: 3,
        APARTMENTS: 0,
        JOBS: 15,
        HAPPINESS: 5,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.CONCRETE]: 10,
            [MATERIALS.GLASS]: 10
        }
    }),
    MARKET: setBuilding({
        NAME: "market",
        TYPE: BUILDING_TYPES.COMMERCIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 2,
        HAPPINESS: 1,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 10
        }
    }),
    GROCERY_STORE: setBuilding({
        NAME: "grocery_store",
        TYPE: BUILDING_TYPES.COMMERCIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 3,
        HAPPINESS: 2,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10
        }
    }),
    SHOPPING_CENTER: setBuilding({
        NAME: "shopping_center",
        TYPE: BUILDING_TYPES.COMMERCIAL,
        WIDTH: 2,
        HEIGHT: 2,
        APARTMENTS: 0,
        JOBS: 10,
        HAPPINESS: 3,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.GLASS]: 10
        }
    }),
    BANK: setBuilding({
        NAME: "bank",
        TYPE: BUILDING_TYPES.COMMERCIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 5,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.GLASS]: 10
        }
    }),
    BASIC_OFFICE: setBuilding({
        NAME: "basic_office",
        TYPE: BUILDING_TYPES.OFFICE,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 5,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10
        }
    }),
    CORPORATE_OFFICE: setBuilding({
        NAME: "corporate_office",
        TYPE: BUILDING_TYPES.OFFICE,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 8,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.GLASS]: 10
        }
    }),
    SKYSCRAPER: setBuilding({
        NAME: "skyscraper",
        TYPE: BUILDING_TYPES.OFFICE,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 12,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 10,
            [MATERIALS.GLASS]: 10
        }
    }),
    FACTORY: setBuilding({
        NAME: "factory",
        TYPE: BUILDING_TYPES.INDUSTRIAL,
        WIDTH: 2,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 8,
        HAPPINESS: -1,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.CONCRETE]: 10
        }
    }),
    COAL_PLANT: setBuilding({
        NAME: "coal_plant",
        TYPE: BUILDING_TYPES.INDUSTRIAL,
        WIDTH: 2,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 6,
        HAPPINESS: -2,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 10,
            [MATERIALS.COAL]: 10
        }
    }),
    NUCLEAR_REACTOR: setBuilding({
        NAME: "nuclear_reactor",
        TYPE: BUILDING_TYPES.INDUSTRIAL,
        WIDTH: 2,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 10,
        HAPPINESS: -1,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 10,
            [MATERIALS.URANIUM]: 10
        }
    }),
    WOODEN_HOUSE: setBuilding({
        NAME: "wooden_house",
        TYPE: BUILDING_TYPES.RESIDENTIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 2,
        JOBS: 0,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 10
        }
    }),
    STONE_HOUSE: setBuilding({
        NAME: "stone_house",
        TYPE: BUILDING_TYPES.RESIDENTIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 3,
        JOBS: 0,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.STONE]: 10
        }
    }),
    CONCRETE_HOUSE: setBuilding({
        NAME: "concrete_house",
        TYPE: BUILDING_TYPES.RESIDENTIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 5,
        JOBS: 0,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 10
        }
    }),
    SOVIET_BLOCK: setBuilding({
        NAME: "soviet_block",
        TYPE: BUILDING_TYPES.RESIDENTIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 6,
        JOBS: 0,
        HAPPINESS: -2,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 10
        }
    }),
    APARTMENT_BLOCK: setBuilding({
        NAME: "apartment_block",
        TYPE: BUILDING_TYPES.RESIDENTIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 10,
        JOBS: 0,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 10,
            [MATERIALS.STEEL]: 10
        }
    }),
    PENTHOUSE: setBuilding({
        NAME: "penthouse",
        TYPE: BUILDING_TYPES.RESIDENTIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 15,
        JOBS: 0,
        HAPPINESS: 2,
        MONEY_COST: 0,
        MATERIAL_COST: {
            [MATERIALS.GLASS]: 10,
            [MATERIALS.STEEL]: 10
        }
    }),
};

BUILDINGS.UNIVERSITY.REQUIRED_BUILDING = BUILDINGS.SCHOOL;
BUILDINGS.NUCLEAR_REACTOR.REQUIRED_BUILDING = BUILDINGS.COAL_PLANT;

 /**
 * @param {BuildingConfig} config
 */
function setBuilding(config) {
    return {
        REQUIRED_BUILDING: null,
        ...config
    };
}