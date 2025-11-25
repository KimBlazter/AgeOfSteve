import { produce } from "immer";
import { StateCreator } from "zustand";
import { GameStore } from "./game";
import { SlotType } from "./equipments";
import { type EffectKey, EFFECTS } from "@/data/effects";
import { Texture } from "@/utils/spriteLoader";
import { GameItemKey } from "@/data/items";

export type ToolType = "axe" | "pickaxe" | "shovel" | "hoe";

export type ItemEffect = {
    id: EffectKey;
    name: string;
    description: string;
    icon: Texture;
    duration?: number; // Duration in ms, if applicable
    value?: number;
};

// Base Item Interface
// This interface defines the common properties for all items in the game.
export interface BaseItem {
    id: string;
    name: string;
    description?: string;
    texture: Texture;
    stackable: boolean;
    quantity?: number; // Optional quantity for stackable items
}

// Tool
export interface ToolItem extends BaseItem {
    type: "tool";
    toolType: ToolType;
    equipmentSlot?: SlotType;
    damage: number; // Damage dealt by the tool
}

// Weapon
export interface WeaponItem extends BaseItem {
    type: "weapon";
    damage: number; // damage dealt by the weapon
    attackSpeed?: number; // optional attack speed, if applicable
    equipmentSlot: SlotType;
}

// Armor
export interface ArmorItem extends BaseItem {
    type: "armor";
    defense: number;
    equipmentSlot: SlotType;
}

// Consumable
export interface ConsumableItem extends BaseItem {
    type: "consumable";
    consumeOnUse?: boolean; // whether the item is consumed on use
    effect: ItemEffect;
}

// Generic Item
export interface GenericItem extends BaseItem {
    type: "generic";
}

export interface ResourceItem extends BaseItem {
    type: "resource";
}

export type Item =
    | ToolItem
    | WeaponItem
    | ArmorItem
    | ConsumableItem
    | GenericItem
    | ResourceItem;

export interface ItemSlice {
    items: Item[];
    addItem: (item: Item, quantity?: number) => void;
    removeItem: (item: Item, quantity?: number) => void;
    useItem: (item: Item) => void;
    hasItem: (id: GameItemKey, amount?: number) => boolean;
    getItemCount: (id: GameItemKey) => number;
}

export const createItemSlice: StateCreator<GameStore, [], [], ItemSlice> = (
    set,
    get
) => ({
    items: [],
    addItem: (item, qty = 1) => {
        set(
            produce((state: ItemSlice) => {
                // Check if the item is stackable
                if (!item.stackable) {
                    state.items.push(item);
                } else {
                    // If not stackable, add a new item instance
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        existing.quantity = (existing.quantity || 0) + qty;
                        return; // Exit early if item already exists
                    }
                    // Otherwise, add a new item instance
                    item = { ...item, quantity: qty }; // Ensure quantity is set
                    state.items.push(item);
                }
            })
        );
        get().checkAchievements();
    },
    removeItem: (item, quantity = 1) =>
        set(
            produce((state: ItemSlice) => {
                let qtyToRemove = quantity;

                // Traverse the items array to find and remove the item(s)
                for (
                    let i = 0;
                    i < state.items.length && qtyToRemove > 0;
                    i++
                ) {
                    const current = state.items[i];
                    if (current.id === item.id) {
                        if (current.stackable && current.quantity) {
                            const removeQty = Math.min(
                                current.quantity,
                                qtyToRemove
                            );
                            current.quantity -= removeQty;
                            qtyToRemove -= removeQty;

                            // Delete the item if quantity goes to zero
                            if (current.quantity <= 0) {
                                state.items.splice(i, 1);
                                i--; // Decrement index to account for removed item
                            }
                        } else {
                            // Non stackable : remove the item directly
                            state.items.splice(i, 1);
                            qtyToRemove--;
                            i--; // Decrement index to account for removed item
                        }
                    }
                }
            })
        ),
    useItem: (item) => {
        switch (item.type) {
            case "armor":
            case "tool":
            case "weapon":
                get().equipItem(item);
                break;
            case "consumable":
                // Call the effect function
                EFFECTS[item.effect.id](
                    item.effect.value,
                    item.effect.duration,
                    item.effect
                );
                if (item.consumeOnUse) {
                    get().removeItem(item);
                }
                break;
            default:
                console.log("[INFO] Unusable item");
        }
    },
    hasItem: (id, amount?) => {
        const count = get()
            .items.filter((item: Item) => item.id === id)
            .reduce((acc, item) => {
                return acc + (item.quantity || 1); // Use quantity if available, otherwise count as 1
            }, 0);
        return count >= (amount ?? 1);
    },
    getItemCount: (id) => {
        return get()
            .items.filter((item: Item) => item.id === id)
            .reduce((acc, item) => {
                return acc + (item.quantity || 1); // Use quantity if available, otherwise count as 1
            }, 0);
    },
});
