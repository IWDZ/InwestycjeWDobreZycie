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
  * @property {number} MONEY_PER_JOB
  * @property {Object<string, number>} MATERIAL_COST
  * @property {string} REQUIRED_BUILDING
  */

import { isTestMode } from "./utils/generalUtils.js";

export const GAMES = new Map();
export const PLAYERS = new Map();
export const GAME_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPRSTUWVXYZabcdefghijklmnoprstuwvxyz1234567890";
export const GAME_CODE_LENGTH = 6;
export const MIN_PLAYERS = isTestMode() ? 1 : 2;
export const MAX_PLAYERS = 6;
export const MAX_FIELD_SIZE = 7;
export const EMPTY_CELL_INDICATOR = "empty";
export const DEFAULT_CELL_PRICE = 5000;
export const CELL_PRICE_INCREASE = 1000;
export const POPULATION = 300;
export const START_MONEY = 7500;
export const START_HAPPINESS = 50;
export const WORTH_PER_PERSON = 750;
export const HAPPINESS_MULTIPLIER = 0.05;
export const WORK_MULTIPLIER = 0.02;
export const SECONDS_BEFORE_GAME_START = 4;
export const GAME_TICK_SECONDS = 3;
export const MARKET_UPDATE_TICK_INTERVAL = 3;
export const LEADERBOARD_UPDATE_TICK_INTERVAL = 3;
export const GAME_DURATION_TICKS = 240;
export const MATERIAL_SELL_TAX = 0.15;

export const POPULATION_POOL_PERCENT_MIN = 50;
export const POPULATION_POOL_PERCENT_MAX = 100;
export const POPULATION_POOL_PERCENT_DEFAULT = 100;

export const MARKET_VOLATILITY_MIN = 0.5;
export const MARKET_VOLATILITY_MAX = 5;
export const MARKET_VOLATILITY_DEFAULT = 1;

export const GAME_DURATION_TICKS_MIN = 120;
export const GAME_DURATION_TICKS_MAX = 600;
export const GAME_DURATION_TICKS_DEFAULT = 240;

export const BUILDING_TYPES = Object.freeze({
    SPECIAL: "Special",
    RECREATIONAL: "Recreational",
    COMMERCIAL: "Commercial",
    OFFICE: "Office",
    INDUSTRIAL: "Industrial",
    RESIDENTIAL: "Residential"
});

export const MATERIALS = Object.freeze({
    STEEL: "steel",
    CONCRETE: "concrete",
    WOOD: "wood",
    STONE: "stone",
    GLASS: "glass",
    COAL: "coal",
    URANIUM: "uranium"
});

export const START_MATERIALS = Object.freeze({
    [MATERIALS.STEEL]: 50,
    [MATERIALS.CONCRETE]: 50,
    [MATERIALS.WOOD]: 50,
    [MATERIALS.STONE]: 50,
    [MATERIALS.GLASS]: 0,
    [MATERIALS.COAL]: 0,
    [MATERIALS.URANIUM]: 0
});

export const MATERIAL_PRICES = Object.freeze({
    [MATERIALS.WOOD]: 10,
    [MATERIALS.STONE]: 15,
    [MATERIALS.COAL]: 20,
    [MATERIALS.CONCRETE]: 25,
    [MATERIALS.STEEL]: 35,
    [MATERIALS.GLASS]: 50,
    [MATERIALS.URANIUM]: 150
})

export const BUILDINGS = Object.freeze({
    TOWN_HALL: setBuilding({
        NAME: "town_hall",
        TYPE: BUILDING_TYPES.SPECIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 5,
        JOBS: 5,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MONEY_PER_JOB: 40,
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
        MONEY_COST: 16000,
        MONEY_PER_JOB: 120,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 500,
            [MATERIALS.CONCRETE]: 500,
            [MATERIALS.GLASS]: 150
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
        MONEY_COST: 7000,
        MONEY_PER_JOB: 90,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 350,
            [MATERIALS.CONCRETE]: 400
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
        MONEY_COST: 800,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 30
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
        MONEY_COST: 1000,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 20
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
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.STONE]: 50,
            [MATERIALS.WOOD]: 40
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
        MONEY_COST: 2500,
        MONEY_PER_JOB: 30,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 40,
            [MATERIALS.CONCRETE]: 15
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
        MONEY_COST: 5000,
        MONEY_PER_JOB: 58,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 150,
            [MATERIALS.CONCRETE]: 100,
            [MATERIALS.GLASS]: 30
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
        MONEY_COST: 2500,
        MONEY_PER_JOB: 35,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 80,
            [MATERIALS.STEEL]: 50,
            [MATERIALS.WOOD]: 30
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
        MONEY_COST: 6000,
        MONEY_PER_JOB: 85,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 200,
            [MATERIALS.STEEL]: 100,
            [MATERIALS.GLASS]: 60
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
        MONEY_COST: 20000,
        MONEY_PER_JOB: 95,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 600,
            [MATERIALS.CONCRETE]: 700,
            [MATERIALS.GLASS]: 150
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
        MONEY_COST: 500,
        MONEY_PER_JOB: 20,
        MATERIAL_COST: {}
    }),
    GROCERY_STORE: setBuilding({
        NAME: "grocery_store",
        TYPE: BUILDING_TYPES.COMMERCIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 3,
        HAPPINESS: 2,
        MONEY_COST: 1500,
        MONEY_PER_JOB: 28,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 40,
            [MATERIALS.WOOD]: 20
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
        MONEY_COST: 6000,
        MONEY_PER_JOB: 70,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 100,
            [MATERIALS.CONCRETE]: 80,
            [MATERIALS.GLASS]: 50
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
        MONEY_COST: 3500,
        MONEY_PER_JOB: 55,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 100,
            [MATERIALS.CONCRETE]: 80,
            [MATERIALS.GLASS]: 50
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
        MONEY_COST: 2000,
        MONEY_PER_JOB: 30,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 80,
            [MATERIALS.CONCRETE]: 60,
            [MATERIALS.GLASS]: 20
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
        MONEY_COST: 3500,
        MONEY_PER_JOB: 45,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 110,
            [MATERIALS.CONCRETE]: 80,
            [MATERIALS.GLASS]: 40
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
        MONEY_COST: 5500,
        MONEY_PER_JOB: 60,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 180,
            [MATERIALS.CONCRETE]: 80,
            [MATERIALS.GLASS]: 100
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
        MONEY_COST: 4500,
        MONEY_PER_JOB: 50,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 150,
            [MATERIALS.CONCRETE]: 80
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
        MONEY_COST: 4000,
        MONEY_PER_JOB: 60,
        MATERIAL_COST: {
            [MATERIALS.COAL]: 60,
            [MATERIALS.STEEL]: 80,
            [MATERIALS.CONCRETE]: 80,
            [MATERIALS.STONE]: 60
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
        MONEY_COST: 12000,
        MONEY_PER_JOB: 110,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 300,
            [MATERIALS.CONCRETE]: 200,
            [MATERIALS.URANIUM]: 120
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
        MONEY_COST: 800,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.WOOD]: 30
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
        MONEY_COST: 1100,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.STONE]: 35,
            [MATERIALS.WOOD]: 15
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
        MONEY_COST: 1600,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 50,
            [MATERIALS.STEEL]: 15
        }
    }),
    SOVIET_BLOCK: setBuilding({
        NAME: "soviet_block",
        TYPE: BUILDING_TYPES.RESIDENTIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 6,
        JOBS: 0,
        HAPPINESS: -1,
        MONEY_COST: 1800,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 50,
            [MATERIALS.STEEL]: 25
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
        MONEY_COST: 3000,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 100,
            [MATERIALS.STEEL]: 60
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
        MONEY_COST: 4500,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 80,
            [MATERIALS.CONCRETE]: 60,
            [MATERIALS.GLASS]: 50
        }
    }),
});

BUILDINGS.UNIVERSITY.REQUIRED_BUILDING = BUILDINGS.SCHOOL.NAME;
BUILDINGS.NUCLEAR_REACTOR.REQUIRED_BUILDING = BUILDINGS.COAL_PLANT.NAME;

export const BONUS_BUILDINGS = Object.freeze({
    [BUILDINGS.AIRPORT]: 10000,
    [BUILDINGS.NUCLEAR_REACTOR]: 10000,
    [BUILDINGS.STADIUM]: 10000
});

export const ATOMIC_BOMB = Object.freeze({
    MATERIAL_COST: Object.freeze({
        [MATERIALS.URANIUM]: 750,
        [MATERIALS.STEEL]: 350,
        [MATERIALS.COAL]: 250
    }),
    MONEY_COST: 50000,
    REQUIRED_BUILDING: BUILDINGS.NUCLEAR_REACTOR.NAME
});

 /**
 * @param {BuildingConfig} config
 */
function setBuilding(config) {
    return Object.freeze({
        REQUIRED_BUILDING: null,
        ...config,
        MATERIAL_COST: Object.freeze(config.MATERIAL_COST)
    });
}

const errorCodes = [
  "invalid_data",
  "player_already_in_game",
  "game_not_found",
  "player_not_found",
  "game_already_started",
  "game_full",
  "username_taken",
  "not_enough_players",
  "no_adjacent_cells_owned",
  "not_enough_money",
  "not_enough_materials",
  "building_not_found",
  "no_required_building",
  "out_of_bounds",
  "port_error",
  "cell_occupied",
  "cell_not_owned",
  "cell_not_a_building",
  "cannot_place_town_hall",
  "cannot_delete_town_hall",
  "unexpected_building_bounds",
  "host_feature",
  "self_nuke",
  "target_not_found",
  "game_not_started"
];

export const ERRORS = Object.freeze(
    Object.fromEntries(
        errorCodes.map(key => [key.toUpperCase(), key])
    )
);