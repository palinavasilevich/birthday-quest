import { ITEMS } from "@/data/items";
import type { Characteristic, CheckTag } from "@/types/game";

export function getCharacteristicBonus(
  inventory: string[],
  characteristic: Characteristic,
): number {
  return inventory.reduce((total, itemId) => {
    const item = ITEMS[itemId];

    return total + (item?.bonuses?.[characteristic] ?? 0);
  }, 0);
}

export function getSituationalBonus(
  inventory: string[],
  tag: CheckTag,
): number {
  return inventory.reduce((total, itemId) => {
    const item = ITEMS[itemId];

    return total + (item?.situationalBonuses?.[tag] ?? 0);
  }, 0);
}
