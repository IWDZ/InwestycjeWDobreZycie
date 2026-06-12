import { Materials, parseMaterialCost } from "./Materials";
import { locale } from "../../../locale/Locale";

export enum BuildingType {
  RESIDENTIAL,
  COMMERCIAL,
  OFFICE,
  RECREATIONAL,
  INDUSTRIAL,
  SPECIAL,
}

export function getBuildingTypeName(type: BuildingType): string {
  switch (type) {
    case BuildingType.RESIDENTIAL:
      return locale.t("buildingtype.residential");
    case BuildingType.COMMERCIAL:
      return locale.t("buildingtype.commercial");
    case BuildingType.OFFICE:
      return locale.t("buildingtype.office");
    case BuildingType.RECREATIONAL:
      return locale.t("buildingtype.recreational");
    case BuildingType.INDUSTRIAL:
      return locale.t("buildingtype.industrial");
    case BuildingType.SPECIAL:
      return locale.t("buildingtype.special");
  }
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

export function getBuildingName(id: string): string {
  return locale.t(`building.${id}`);
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

  moneyEarn: number;

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
  moneyEarn: number,
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
  moneyEarn,
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

export function getBuildingById(id: string) {
  return BUILDINGS.find((b) => b.id.toLowerCase() === id);
}

export function parseBuildingsFromServer(
  buildings: Record<string, any>,
): Building[] {
  return Object.entries(buildings).map(([key, b]) =>
    createBuilding(
      key,
      getBuildingName(b.NAME),
      TYPE_MAP[b.TYPE],
      b.WIDTH,
      b.HEIGHT,
      b.APARTMENTS,
      b.JOBS,
      b.HAPPINESS,
      b.MONEY_COST,
      b.MATERIAL_COST ? parseMaterialCost(b.MATERIAL_COST) : {},
      b.REQUIRED_BUILDING,
      b.MONEY_PER_JOB,
    ),
  );
}
