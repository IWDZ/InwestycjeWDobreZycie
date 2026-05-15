import { Materials } from "./Materials";

export enum BuildingType {
    RESIDENTIAL = "Mieszkalny",
    COMMERCIAL = "Komercyjny",
    OFFICE = "Biurowy",
    RECREATIONAL = "Rekreacyjny",
    INDUSTRIAL = "Industrialny",
    SPECIAL = "Specjalny",
}

export type Building = {
    id: string;
    name: string;

    type: BuildingType;

    width: number;
    height: number;

    apartments: number;
    jobs: number;
    happiness: number;

    materialCost: Partial<Record<Materials, number>>;
    moneyCost: number;

    requiredBuilding?: string | null;

    locked: boolean;
};

export const createBuilding = (
    id: string,
    name: string,

    type: BuildingType,

    width: number,
    height: number,

    apartments: number,
    jobs: number,
    happiness: number,

    moneyCost: number,
    materialCost: Partial<Record<Materials, number>>,

    requiredBuilding: string | null = null,
    locked: boolean = false
): Building => ({
    locked,
    id,
    name,

    type,

    width,
    height,

    apartments,
    jobs,
    happiness,

    moneyCost,
    materialCost,

    requiredBuilding
});

export const BUILDINGS: Building[] = [
    createBuilding(
        "town-hall",
        "Ratusz",
        BuildingType.SPECIAL,
        1,
        1,
        5,
        5,
        0,
        0,
        {},
        null,
        true
    ),

    createBuilding(
        "wooden-house",
        "Drewniany domek",
        BuildingType.RESIDENTIAL,
        1,
        1,
        2,
        0,
        0,
        800,
        {
            [Materials.Wood]: 30
        }
    ),

    createBuilding(
        "stone-house",
        "Kamienny domek",
        BuildingType.RESIDENTIAL,
        1,
        1,
        3,
        0,
        0,
        1100,
        {
            [Materials.Stone]: 35,
            [Materials.Wood]: 15
        }
    ),

    createBuilding(
        "concrete-house",
        "Nowoczesny domek",
        BuildingType.RESIDENTIAL,
        1,
        1,
        5,
        0,
        0,
        1600,
        {
            [Materials.Concrete]: 50,
            [Materials.Steel]: 15
        }
    ),

    createBuilding(
        "soviet-block",
        "Sowiecki blok",
        BuildingType.RESIDENTIAL,
        1,
        1,
        6,
        0,
        -2,
        2200,
        {
            [Materials.Concrete]: 80,
            [Materials.Steel]: 25
        }
    ),

    createBuilding(
        "block",
        "Blok mieszkalny",
        BuildingType.RESIDENTIAL,
        1,
        1,
        10,
        0,
        0,
        3000,
        {
            [Materials.Concrete]: 100,
            [Materials.Steel]: 60
        }
    ),

    createBuilding(
        "penthouse",
        "Penthouse",
        BuildingType.RESIDENTIAL,
        1,
        1,
        15,
        0,
        2,
        4500,
        {
            [Materials.Steel]: 80,
            [Materials.Concrete]: 60,
            [Materials.Glass]: 50
        }
    ),

    createBuilding(
        "playground",
        "Plac Zabaw",
        BuildingType.RECREATIONAL,
        1,
        1,
        0,
        0,
        1,
        800,
        {
            [Materials.Wood]: 30
        }
    ),

    createBuilding(
        "park",
        "Park",
        BuildingType.RECREATIONAL,
        1,
        1,
        0,
        0,
        2,
        1000,
        {
            [Materials.Concrete]: 20
        }
    ),

    createBuilding(
        "church",
        "Kościół",
        BuildingType.RECREATIONAL,
        1,
        1,
        0,
        0,
        2,
        2000,
        {
            [Materials.Stone]: 100,
            [Materials.Wood]: 40
        }
    ),

    createBuilding(
        "school",
        "Szkoła",
        BuildingType.RECREATIONAL,
        1,
        1,
        0,
        5,
        2,
        2500,
        {
            [Materials.Concrete]: 80,
            [Materials.Steel]: 50,
            [Materials.Wood]: 30
        }
    ),

    createBuilding(
        "police",
        "Komisariat",
        BuildingType.RECREATIONAL,
        1,
        1,
        0,
        4,
        1,
        2500,
        {
            [Materials.Steel]: 80,
            [Materials.Concrete]: 30
        }
    ),

    createBuilding(
        "hospital",
        "Szpital",
        BuildingType.RECREATIONAL,
        1,
        1,
        0,
        8,
        3,
        5000,
        {
            [Materials.Steel]: 150,
            [Materials.Concrete]: 100,
            [Materials.Glass]: 30
        }
    ),

    createBuilding(
        "university",
        "Uniwersytet",
        BuildingType.RECREATIONAL,
        2,
        2,
        0,
        12,
        3,
        6000,
        {
            [Materials.Concrete]: 200,
            [Materials.Steel]: 100,
            [Materials.Glass]: 60
        },
        "school"
    ),

    createBuilding(
        "stadium",
        "Stadion",
        BuildingType.RECREATIONAL,
        2,
        3,
        0,
        15,
        5,
        20000,
        {
            [Materials.Steel]: 600,
            [Materials.Concrete]: 700,
            [Materials.Glass]: 150
        }
    ),

    createBuilding(
        "market",
        "Targ",
        BuildingType.COMMERCIAL,
        1,
        1,
        0,
        2,
        1,
        500,
        {}
    ),

    createBuilding(
        "shop",
        "Sklep spożywczy",
        BuildingType.COMMERCIAL,
        1,
        1,
        0,
        3,
        2,
        1500,
        {
            [Materials.Steel]: 40,
            [Materials.Wood]: 20
        }
    ),

    createBuilding(
        "bank",
        "Bank",
        BuildingType.COMMERCIAL,
        1,
        1,
        0,
        5,
        0,
        3500,
        {
            [Materials.Steel]: 100,
            [Materials.Concrete]: 50,
            [Materials.Glass]: 50
        }
    ),

    createBuilding(
        "trade-center",
        "Centrum handlowe",
        BuildingType.COMMERCIAL,
        2,
        2,
        0,
        10,
        3,
        6000,
        {
            [Materials.Steel]: 200,
            [Materials.Concrete]: 80,
            [Materials.Glass]: 80
        }
    ),

    createBuilding(
        "basic-office",
        "Podstawowy biurowiec",
        BuildingType.OFFICE,
        1,
        1,
        0,
        5,
        0,
        2000,
        {
            [Materials.Steel]: 80,
            [Materials.Concrete]: 40
        }
    ),

    createBuilding(
        "corporate-office",
        "Firmowy biurowiec",
        BuildingType.OFFICE,
        1,
        1,
        0,
        8,
        0,
        3500,
        {
            [Materials.Steel]: 120,
            [Materials.Concrete]: 60,
            [Materials.Glass]: 40
        }
    ),

    createBuilding(
        "high-office",
        "Duży biurowiec",
        BuildingType.OFFICE,
        1,
        1,
        0,
        12,
        0,
        5500,
        {
            [Materials.Steel]: 180,
            [Materials.Concrete]: 80,
            [Materials.Glass]: 100
        }
    ),

    createBuilding(
        "factory",
        "Fabryka",
        BuildingType.INDUSTRIAL,
        2,
        1,
        0,
        8,
        -1,
        4500,
        {
            [Materials.Steel]: 150,
            [Materials.Concrete]: 80
        }
    ),

    createBuilding(
        "port",
        "Port",
        BuildingType.SPECIAL,
        1,
        2,
        0,
        8,
        1,
        7000,
        {
            [Materials.Steel]: 400,
            [Materials.Concrete]: 350
        }
    ),

    createBuilding(
        "airport",
        "Lotnisko",
        BuildingType.SPECIAL,
        2,
        3,
        0,
        10,
        4,
        16000,
        {
            [Materials.Steel]: 500,
            [Materials.Concrete]: 500,
            [Materials.Glass]: 150
        }
    ),

    createBuilding(
        "coal-plant",
        "Elektrownia węglowa",
        BuildingType.INDUSTRIAL,
        2,
        1,
        0,
        6,
        -2,
        4000,
        {
            [Materials.Coal]: 60,
            [Materials.Steel]: 80,
            [Materials.Concrete]: 80,
            [Materials.Stone]: 60
        }
    ),

    createBuilding(
        "nuclear-planet",
        "Elektrownia jądrowa",
        BuildingType.INDUSTRIAL,
        2,
        1,
        0,
        10,
        -1,
        12000,
        {
            [Materials.Uranium]: 40,
            [Materials.Steel]: 300,
            [Materials.Concrete]: 200,
            [Materials.Glass]: 120
        },
        "coal-plant"
    )
];