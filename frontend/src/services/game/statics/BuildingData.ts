import { Materials } from "./Materials"

export type Building = {
    id: string;
    name: string;
    materialCost: Partial<Record<Materials, number>>;
    moneyCost: number;
};

export const createBuilding = (
    id: string,
    name: string,
    moneyCost: number,
    materialCost: Partial<Record<Materials, number>>
): Building => ({
    id,
    name,
    moneyCost,
    materialCost
});

// TODO: Dodaj width i height
export const BUILDINGS: Building[] = [
    createBuilding("town-hall", "Ratusz", 0, {}), // ratusz jest darmowy i limitowany bo jest domyslnie postawiony
    createBuilding("airport", "Lotnisko", 15000, {
        [Materials.Steel]: 400,
        [Materials.Concrete]: 400,
        [Materials.Glass]: 100,
    }),
    createBuilding("port", "Port", 6500, {
        [Materials.Steel]: 300,
        [Materials.Concrete]: 300,
    }),

    createBuilding("playground", "Plac Zabaw", 1500, {
        [Materials.Wood]: 50
    }),

    createBuilding("park", "Park", 2000, {
        [Materials.Concrete]: 30,
    }),

    createBuilding("church", "Kościół", 2200, {
        [Materials.Stone]: 100,
        [Materials.Wood]: 50
    }),

    createBuilding("police", "Komisariat", 2500, {
        [Materials.Steel]: 100
    }),

    createBuilding("hospital", "Szpital", 4000, {
        [Materials.Steel]: 125,
        [Materials.Concrete]: 70
    }),

    createBuilding("school", "Szkoła", 2000, {
        [Materials.Concrete]: 100,
        [Materials.Steel]: 50,
        [Materials.Wood]: 50
    }),

    createBuilding("university", "Uniwersytet", 5000, {
        [Materials.Concrete]: 150,
        [Materials.Steel]: 70,
        [Materials.Glass]: 50
    }),

    createBuilding("stadium", "Stadion", 15000, {
        [Materials.Glass]: 120,
        [Materials.Steel]: 500,
        [Materials.Concrete]: 600
    }),

    createBuilding("market", "Targ", 1000, {}),

    createBuilding("shop", "Sklep spożywczy", 2000, {
        [Materials.Steel]: 60
    })
];