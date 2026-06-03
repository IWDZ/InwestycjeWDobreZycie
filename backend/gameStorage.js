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
export const GAMES = new Map();
export const GAME_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPRSTUWVXYZabcdefghijklmnoprstuwvxyz1234567890";
export const GAME_CODE_LENGTH = 6;
export const MAX_PLAYERS = 6;
export const MAX_FIELD_SIZE = 7;
export const POPULATION = 300;
export const START_MONEY = 5000;
export const START_HAPPINESS = 50;
export const WORTH_PER_PERSON = 750;
export const HAPPINESS_MULTIPLIER = 0.05;
export const WORK_MULTIPLIER = 0.02;
export const GAME_TICK_SECONDS = 3;
export const MARKET_UPDATE_TICK_INTERVAL = 3;
export const GAME_DURATION_TICKS = 120;

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

export const ATOMIC_BOMB = {
    MATERIAL_COST: {
        [MATERIALS.URANIUM]: 750,
        [MATERIALS.STEEL]: 350,
        [MATERIALS.COAL]: 250
    },
    MONEY_COST: 50000
}

export const START_MATERIALS = {
    [MATERIALS.STEEL]: 0,
    [MATERIALS.CONCRETE]: 0,
    [MATERIALS.WOOD]: 0,
    [MATERIALS.STONE]: 0,
    [MATERIALS.GLASS]: 0,
    [MATERIALS.COAL]: 0,
    [MATERIALS.URANIUM]: 0
};

export const MATERIAL_PRICES = {
    [MATERIALS.WOOD]: 10,
    [MATERIALS.STONE]: 15,
    [MATERIALS.COAL]: 20,
    [MATERIALS.CONCRETE]: 25,
    [MATERIALS.STEEL]: 35,
    [MATERIALS.GLASS]: 50,
    [MATERIALS.URANIUM]: 150
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
            [MATERIALS.STONE]: 100,
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
        MONEY_COST: 5000,
        MONEY_PER_JOB: 32,
        MATERIAL_COST: {
            [MATERIALS.STEEL]: 80,
            [MATERIALS.CONCRETE]: 30
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
            [MATERIALS.STEEL]: 120,
            [MATERIALS.CONCRETE]: 80,
            [MATERIALS.GLASS]: 40
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
            [MATERIALS.STEEL]: 120,
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
        MONEY_PER_JOB: 65,
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
            [MATERIALS.URANIUM]: 40,
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
        HAPPINESS: -2,
        MONEY_COST: 2200,
        MONEY_PER_JOB: 0,
        MATERIAL_COST: {
            [MATERIALS.CONCRETE]: 80,
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