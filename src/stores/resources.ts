import { StateCreator } from "zustand";
import { Item, ToolType } from "./items";
import { resources } from "@/data/resources";
import { GameStore } from "./game";
import { Texture } from "@/utils/spriteLoader";

export type Resource = "wood" | "cobblestone" | "iron";

export interface LootDrop {
    item: Item;
    minQuantity: number; // Minimum quantity to drop
    maxQuantity: number; // Maximum quantity to drop
    chance: number; // Probability (0-1) that this drop will occur
    resourceType?: Resource; // Optional: links this drop to a resource type for applying multipliers
}

export interface ResourceData {
    name: string;
    texture: Texture; // image identifier
    lootTable: LootDrop[]; // List of possible drops with their chances
    effective_tool: ToolType;
    hp: number; // Base health points for the resource
}

export type Resources = Record<Resource, ResourceData>;

export interface ResourceSlice {
    resources: Resources;
}

export const createResourceSlice: StateCreator<
    GameStore,
    [],
    [],
    ResourceSlice
> = () => ({
    resources: resources,
});
