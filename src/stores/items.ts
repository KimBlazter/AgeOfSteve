import { produce } from "immer";
import { StateCreator } from "zustand";
import { nanoid } from "nanoid";
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
    instanceId?: string; // Unique identifier for this specific item instance (added when item is added to inventory)
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

// Type for items that are in the inventory (always have instanceId)
export type ItemWithInstance = Item & { instanceId: string };

export interface InventoryFilters {
    search?: string;
    type?: Item["type"] | "all";
    equipmentSlot?: SlotType | "all";
    stackable?: boolean | "all";
}

export interface ItemSlice {
    items: ItemWithInstance[];
    getItems: () => ItemWithInstance[];
    filters: InventoryFilters;
    setFilters: (patch: Partial<InventoryFilters>) => void;
    resetFilters: () => void;
    getFilteredItems: () => ItemWithInstance[];
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
    getItems: () => {
        return get().items;
    },
    filters: {
        search: "all",
        type: "all",
        equipmentSlot: "all",
        stackable: "all",
    },
    setFilters: (patch) =>
    set((state) => ({
        filters: {
            ...state.filters,
            ...patch,
        },
    })),
    resetFilters: () =>
    set({
        filters: {
            search: "",
            type: "all",
            equipmentSlot: "all",
            stackable: "all",
        },
    }),
    getFilteredItems: () => {
        const {items, filters} = get();
        return items.filter((item) => {
            // Filter by search term
            if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Item type
            if (filters.type && filters.type !== "all" && item.type !== filters.type) {
                return false;
            }
        })
    },
    addItem: (item, qty = 1) => {
        set(
            produce((state: ItemSlice) => {
                // Check if the item is stackable
                if (!item.stackable) {
                    // For non-stackable items, add new instance
                    state.items.push({
                        ...item,
                        instanceId: item.instanceId || nanoid(),
                    });
                } else {
                    // If not stackable, check if item already exists in inventory
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        existing.quantity = (existing.quantity || 0) + qty;
                        return; // Exit early if item already exists
                    }
                    // Otherwise, add a new item instance
                    const newItem: ItemWithInstance = {
                        ...item,
                        quantity: qty,
                        instanceId: item.instanceId || nanoid(),
                    }; // Ensure quantity and instanceId are set
                    state.items.push(newItem);
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
            .items.filter((item) => item.id === id)
            .reduce((acc, item) => {
                return acc + (item.quantity || 1); // Use quantity if available, otherwise count as 1
            }, 0);
        return count >= (amount ?? 1);
    },
    getItemCount: (id) => {
        return get()
            .items.filter((item) => item.id === id)
            .reduce((acc, item) => {
                return acc + (item.quantity || 1); // Use quantity if available, otherwise count as 1
            }, 0);
    },
});
