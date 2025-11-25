import { StateCreator } from "zustand";
import { Item } from "./items";
import { crafts } from "@/data/crafts";
import { GameStore } from "./game";
import { GAME_ITEMS, GameItemKey } from "@/data/items";

export interface Craft {
    result: { item: Item; qty: number };
    cost: {
        items?: { key: GameItemKey; amount?: number }[];
    };
}

export type CraftKey = keyof typeof crafts;

export interface CraftSlice {
    crafts: Record<keyof typeof crafts, Craft>;
    craft: (id: CraftKey) => void;
}

export const createCraftSlice: StateCreator<GameStore, [], [], CraftSlice> = (
    _set,
    get
) => ({
    crafts: crafts,
    craft: (id) => {
        const craft = get().crafts[id];

        const enoughItems =
            craft.cost.items?.reduce((acc, item) => {
                return acc && get().hasItem(item.key, item.amount);
            }, true) ?? true;

        if (!enoughItems) return; // TODO: Handle insufficient items message

        // Remove all items
        craft.cost.items?.forEach(
            (item) => get().removeItem({ ...GAME_ITEMS[item.key] }, item.amount) // create fake item to remove it from inventory
        );

        // add item
        get().addItem(craft.result.item, craft.result.qty);
    },
});
