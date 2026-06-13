import { useLocale } from "../../../locale/Locale";

export enum Materials {
  Wood,
  Stone,
  Steel,
  Concrete,
  Glass,
  Coal,
  Uranium,
}

export const MATERIAL_SERVER_KEY: Record<Materials, string> = {
  [Materials.Wood]: "wood",
  [Materials.Stone]: "stone",
  [Materials.Coal]: "coal",
  [Materials.Concrete]: "concrete",
  [Materials.Steel]: "steel",
  [Materials.Glass]: "glass",
  [Materials.Uranium]: "uranium",
};

export const MATERIAL_MAP: Record<string, Materials> = {
  wood: Materials.Wood,
  stone: Materials.Stone,
  steel: Materials.Steel,
  concrete: Materials.Concrete,
  glass: Materials.Glass,
  coal: Materials.Coal,
  uranium: Materials.Uranium,
};

export function parseMaterialCost(
  cost: Record<string, number>,
): Partial<Record<Materials, number>> {
  return Object.fromEntries(
    Object.entries(cost).map(([key, value]) => [MATERIAL_MAP[key], value]),
  );
}

import { locale } from "../../../locale/Locale";

export function getMaterialName(material: Materials): string {
  switch (material) {
    case Materials.Wood:
      return locale.t("material.wood");
    case Materials.Stone:
      return locale.t("material.stone");
    case Materials.Steel:
      return locale.t("material.steel");
    case Materials.Concrete:
      return locale.t("material.concrete");
    case Materials.Glass:
      return locale.t("material.glass");
    case Materials.Coal:
      return locale.t("material.coal");
    case Materials.Uranium:
      return locale.t("material.uranium");
  }
}

export function getMaterialColor(material: Materials): string {
  switch (material) {
    case Materials.Wood:
      return "#a0522d";
    case Materials.Stone:
      return "#888880";
    case Materials.Steel:
      return "#708090";
    case Materials.Concrete:
      return "#b0a898";
    case Materials.Glass:
      return "#a8d8ea";
    case Materials.Coal:
      return "#0c0c0c";
    case Materials.Uranium:
      return "#57a639";
  }
}
