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
    createBuilding("town-hall", "Ratusz", 0, {}),

    createBuilding("wooden-house", "Drewniany domek", 800, { [Materials.Wood]: 30 }),
    createBuilding("stone-house", "Kamienny domek", 1100, { [Materials.Stone]: 35, [Materials.Wood]: 15 }),
    createBuilding("concrete-house", "Nowoczesny domek", 1600, { [Materials.Concrete]: 50, [Materials.Steel]: 15 }),
    createBuilding("soviet-block", "Sowiecki blok", 2200, { [Materials.Concrete]: 80, [Materials.Steel]: 25 }),
    createBuilding("block", "Blok mieszkalny", 3000, { [Materials.Concrete]: 100, [Materials.Steel]: 60 }),
    createBuilding("penthouse", "Penthouse", 4500, { [Materials.Steel]: 80, [Materials.Concrete]: 60, [Materials.Glass]: 50 }),

    createBuilding("playground", "Plac Zabaw", 800, { [Materials.Wood]: 30 }),
    createBuilding("park", "Park", 1000, { [Materials.Concrete]: 20 }),
    createBuilding("church", "Kościół", 2000, { [Materials.Stone]: 100, [Materials.Wood]: 40 }),
    createBuilding("school", "Szkoła", 2500, { [Materials.Concrete]: 80, [Materials.Steel]: 50, [Materials.Wood]: 30 }),
    createBuilding("police", "Komisariat", 2500, { [Materials.Steel]: 80, [Materials.Concrete]: 30 }),
    createBuilding("hospital", "Szpital", 5000, { [Materials.Steel]: 150, [Materials.Concrete]: 100, [Materials.Glass]: 30 }),
    createBuilding("university", "Uniwersytet", 6000, { [Materials.Concrete]: 200, [Materials.Steel]: 100, [Materials.Glass]: 60 }),
    createBuilding("stadium", "Stadion", 20000, { [Materials.Steel]: 600, [Materials.Concrete]: 700, [Materials.Glass]: 150 }),

    createBuilding("market", "Targ", 500, {}),
    createBuilding("shop", "Sklep spożywczy", 1500, { [Materials.Steel]: 40, [Materials.Wood]: 20 }),
    createBuilding("bank", "Bank", 3500, { [Materials.Steel]: 100, [Materials.Concrete]: 50, [Materials.Glass]: 50 }),
    createBuilding("trade-center", "Centrum handlowe", 6000, { [Materials.Steel]: 200, [Materials.Concrete]: 80, [Materials.Glass]: 80 }),

    createBuilding("basic-office", "Podstawowy biurowiec", 2000, { [Materials.Steel]: 80, [Materials.Concrete]: 40 }),
    createBuilding("corporate-office", "Firmowy biurowiec", 3500, { [Materials.Steel]: 120, [Materials.Concrete]: 60, [Materials.Glass]: 40 }),
    createBuilding("high-office", "Duży biurowiec", 5500, { [Materials.Steel]: 180, [Materials.Concrete]: 80, [Materials.Glass]: 100 }),

    createBuilding("factory", "Fabryka", 4500, { [Materials.Steel]: 150, [Materials.Concrete]: 80 }),
    createBuilding("port", "Port", 7000, { [Materials.Steel]: 400, [Materials.Concrete]: 350 }),
    createBuilding("airport", "Lotnisko", 16000, { [Materials.Steel]: 500, [Materials.Concrete]: 500, [Materials.Glass]: 150 }),
    createBuilding("coal-plant", "Elektrownia węglowa", 4000, { [Materials.Coal]: 60, [Materials.Steel]: 80, [Materials.Concrete]: 80, [Materials.Stone]: 60 }),
    createBuilding("nuclear-planet", "Elektrownia jądrowa", 12000, { [Materials.Uranium]: 40, [Materials.Steel]: 300, [Materials.Concrete]: 200, [Materials.Glass]: 120 }),
];