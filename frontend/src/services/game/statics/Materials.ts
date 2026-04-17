
export enum Materials {
    Wood,
    Stone,
    Steel,
    Concrete,
    Glass,
    Coal,
    Uranium
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