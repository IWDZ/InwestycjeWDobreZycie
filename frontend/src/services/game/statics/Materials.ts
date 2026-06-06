
export enum Materials {
    Wood,
    Stone,
    Steel,
    Concrete,
    Glass,
    Coal,
    Uranium
}

const MATERIAL_MAP: Record<string, Materials> = {
    "wood": Materials.Wood,
    "stone": Materials.Stone,
    "steel": Materials.Steel,
    "concrete": Materials.Concrete,
    "glass": Materials.Glass,
    "coal": Materials.Coal,
    "uranium": Materials.Uranium,
};

export function parseMaterialCost(cost: Record<string, number>): Partial<Record<Materials, number>> {
    return Object.fromEntries(
        Object.entries(cost).map(([key, value]) => [MATERIAL_MAP[key], value])
    );
}

export function getMaterialName(material: Materials): string {
    switch (material) {
        case Materials.Wood: return "Drewno"
        case Materials.Stone: return "Kamień"
        case Materials.Steel: return "Stal"
        case Materials.Concrete: return "Beton"
        case Materials.Glass: return "Szkło"
        case Materials.Coal: return "Węgiel"
        case Materials.Uranium: return "Uran"
    }
}

export function getMaterialColor(material: Materials): string {
    switch (material) {
        case Materials.Wood: return '#a0522d'
        case Materials.Stone: return '#888880'
        case Materials.Steel: return '#708090'
        case Materials.Concrete: return '#b0a898'
        case Materials.Glass: return '#a8d8ea'
        case Materials.Coal: return '#0c0c0c'
        case Materials.Uranium: return '#57a639'
    }
}

export function getMaterialBasePrice(material: Materials): number {
    switch (material) {
        case Materials.Wood: return 10
        case Materials.Stone: return 15
        case Materials.Steel: return 35
        case Materials.Concrete: return 25
        case Materials.Glass: return 50
        case Materials.Coal: return 20
        case Materials.Uranium: return 150
    }
}