import { MATERIALS, Materials } from "./materials.js";

export const START_TOWN_HALL_POPULATION = 3;

export const BUILDING_TYPES = {
    SPECIAL: "Special",
    RECREATIONAL: "Recreational",
    COMMERCIAL: "Commercial",
    OFFICE: "Office",
    INDUSTRIAL: "Industrial",
    RESIDENTIAL: "Residential"
} as const;

export const BUILDINGS = {
    TOWN_HALL: {
        NAME: "town_hall",
        TYPE: BUILDING_TYPES.SPECIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 5,
        JOBS: 5,
        HAPPINESS: 0,
        MONEY_COST: 0,
        MONEY_PER_JOB: 40,
        MATERIAL_COST: {},
        REQUIRED_BUILDING: null
    },
    AIRPORT: {
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
        },
        REQUIRED_BUILDING: null
    },
    PORT: {
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
        },
        REQUIRED_BUILDING: null
    },
    PLAYGROUND: {
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
        },
        REQUIRED_BUILDING: null
    },
    PARK: {
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
        },
        REQUIRED_BUILDING: null
    },
    CHURCH: {
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
        },
        REQUIRED_BUILDING: null
    },
    POLICE_STATION: {
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
        },
        REQUIRED_BUILDING: null
    },
    HOSPITAL: {
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
        },
        REQUIRED_BUILDING: null
    },
    SCHOOL: {
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
        },
        REQUIRED_BUILDING: null
    },
    UNIVERSITY: {
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
        },
        REQUIRED_BUILDING: "school"
    },
    STADIUM: {
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
        },
        REQUIRED_BUILDING: null
    },
    MARKET: {
        NAME: "market",
        TYPE: BUILDING_TYPES.COMMERCIAL,
        WIDTH: 1,
        HEIGHT: 1,
        APARTMENTS: 0,
        JOBS: 2,
        HAPPINESS: 1,
        MONEY_COST: 500,
        MONEY_PER_JOB: 20,
        MATERIAL_COST: {},
        REQUIRED_BUILDING: null
    },
    GROCERY_STORE: {
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
        },
        REQUIRED_BUILDING: null
    },
    SHOPPING_CENTER: {
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
        },
        REQUIRED_BUILDING: null
    },
    BANK: {
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
        },
        REQUIRED_BUILDING: null
    },
    BASIC_OFFICE: {
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
        },
        REQUIRED_BUILDING: null
    },
    CORPORATE_OFFICE: {
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
        },
        REQUIRED_BUILDING: null
    },
    SKYSCRAPER: {
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
        },
        REQUIRED_BUILDING: null
    },
    FACTORY: {
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
        },
        REQUIRED_BUILDING: null
    },
    COAL_PLANT: {
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
        },
        REQUIRED_BUILDING: null
    },
    NUCLEAR_REACTOR: {
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
        },
        REQUIRED_BUILDING: "coal_plant"
    },
    WOODEN_HOUSE: {
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
        },
        REQUIRED_BUILDING: null
    },
    STONE_HOUSE: {
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
        },
        REQUIRED_BUILDING: null
    },
    CONCRETE_HOUSE: {
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
        },
        REQUIRED_BUILDING: null
    },
    SOVIET_BLOCK: {
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
        },
        REQUIRED_BUILDING: null
    },
    APARTMENT_BLOCK: {
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
        },
        REQUIRED_BUILDING: null
    },
    PENTHOUSE: {
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
        },
        REQUIRED_BUILDING: null
    }
} as const satisfies Record<string, BuildingConfig>;

export const BONUS_BUILDING_VALUES = {
    [BUILDINGS.AIRPORT.NAME]: 10000,
    [BUILDINGS.NUCLEAR_REACTOR.NAME]: 10000,
    [BUILDINGS.STADIUM.NAME]: 10000
} as const satisfies Partial<Record<BuildingName, number>>;


export type BuildingObject = typeof BUILDINGS[keyof typeof BUILDINGS];

export type BuildingType = typeof BUILDING_TYPES[keyof typeof BUILDING_TYPES];

export type RequiredBuilding = "school" | "coal_plant" | "nuclear_reactor";

export type BuildingName = typeof BUILDINGS[keyof typeof BUILDINGS]["NAME"];

export interface BuildingBounds {
    rowStart: number,
    columnStart: number,
    rowEnd: number,
    columnEnd: number
}

interface BuildingConfig {
    NAME: string;
    TYPE: BuildingType;
    WIDTH: number;
    HEIGHT: number;
    APARTMENTS: number;
    JOBS: number;
    HAPPINESS: number;
    MONEY_COST: number;
    MONEY_PER_JOB: number;
    MATERIAL_COST: Partial<Materials>;
    REQUIRED_BUILDING: RequiredBuilding | null;
}