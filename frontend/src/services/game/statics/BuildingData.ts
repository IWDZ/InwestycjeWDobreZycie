import { Materials, parseMaterialCost } from "./Materials";

export enum BuildingType {
  RESIDENTIAL = "Mieszkalny",
  COMMERCIAL = "Komercyjny",
  OFFICE = "Biurowy",
  RECREATIONAL = "Rekreacyjny",
  INDUSTRIAL = "Industrialny",
  SPECIAL = "Specjalny",
}

export const BUILDING_ICONS: Record<string, string> = {
  wooden_house: "🏡",
  stone_house: "🏠",
  concrete_house: "🏢",
  apartment_block: "🏬",
  soviet_block: "🏗️",
  penthouse: "🌆",
  bank: "🏦",
  grocery_store: "🛒",
  market: "🏪",
  shopping_center: "🛍️",
  basic_office: "🖥️",
  corporate_office: "💼",
  skyscraper: "🏙️",
  factory: "🏭",
  coal_plant: "⚫",
  nuclear_reactor: "☢️",
  park: "🌳",
  playground: "🛝",
  church: "⛪",
  hospital: "🏥",
  school: "🏫",
  university: "🎓",
  stadium: "🏟️",
  police_station: "🚔",
  town_hall: "🏛️",
  airport: "✈️",
  port: "⚓",
};

export const NAME_MAP: Record<string, string> = {
  wooden_house: "Drewniany domek",
  stone_house: "Kamienny domek",
  concrete_house: "Betonowy domek",
  apartment_block: "Blok mieszkalny",
  soviet_block: "Blok sowiecki",
  penthouse: "Penthouse",
  bank: "Bank",
  grocery_store: "Sklep spożywczy",
  market: "Targ",
  shopping_center: "Centrum handlowe",
  basic_office: "Biuro",
  corporate_office: "Biuro korporacyjne",
  skyscraper: "Wieżowiec",
  factory: "Fabryka",
  coal_plant: "Elektrownia węglowa",
  nuclear_reactor: "Reaktor jądrowy",
  park: "Park",
  playground: "Plac zabaw",
  church: "Kościół",
  hospital: "Szpital",
  school: "Szkoła",
  university: "Uniwersytet",
  stadium: "Stadion",
  police_station: "Komisariat",
  town_hall: "Ratusz",
  airport: "Lotnisko",
  port: "Port",
};

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
  locked: boolean = false,
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

  requiredBuilding,
});
const TYPE_MAP: Record<string, BuildingType> = {
  Residential: BuildingType.RESIDENTIAL,
  Commercial: BuildingType.COMMERCIAL,
  Office: BuildingType.OFFICE,
  Recreational: BuildingType.RECREATIONAL,
  Industrial: BuildingType.INDUSTRIAL,
  Special: BuildingType.SPECIAL,
};

export var BUILDINGS: Building[] = [];

export function setBuildings(buildings: Building[]) {
  BUILDINGS = buildings;
}

export function parseBuildingsFromServer(
  buildings: Record<string, any>,
): Building[] {
  return Object.entries(buildings).map(([key, b]) =>
    createBuilding(
      key,
      NAME_MAP[b.NAME] ?? b.NAME,
      TYPE_MAP[b.TYPE],
      b.WIDTH,
      b.HEIGHT,
      b.APARTMENTS,
      b.JOBS,
      b.HAPPINESS,
      b.MONEY_COST,
      b.MATERIAL_COST ? parseMaterialCost(b.MATERIAL_COST) : {},
      b.REQUIRED_BUILDING,
    ),
  );
}
