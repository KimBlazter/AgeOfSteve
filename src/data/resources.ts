import { ResourceData } from "@/stores/resources";
import { GAME_ITEMS } from "./items";

export const resources = {
    wood: {
        name: "Wood",
        texture: "block:oak_log",
        lootTable: [
            {
                item: { ...GAME_ITEMS.oak_log },
                minQuantity: 1,
                maxQuantity: 1,
                chance: 1.0, // Always drops 1 oak log
                resourceType: "wood", // Affected by wood multipliers
            },
            {
                item: { ...GAME_ITEMS.oak_log },
                minQuantity: 1,
                maxQuantity: 2,
                chance: 0.15, // 15% chance for 1-2 bonus oak logs
                resourceType: "wood", // Affected by wood multipliers
            },
        ],
        hp: 100,
        effective_tool: "axe",
    },
    cobblestone: {
        name: "Cobblestone",
        texture: "block:stone",
        lootTable: [
            {
                item: { ...GAME_ITEMS.cobblestone },
                minQuantity: 1,
                maxQuantity: 1,
                chance: 1.0, // Always drops
                resourceType: "cobblestone", // Affected by cobblestone multipliers
            },
            {
                item: { ...GAME_ITEMS.cobblestone },
                minQuantity: 1,
                maxQuantity: 1,
                chance: 0.15, // 15% chance for bonus stone
                resourceType: "cobblestone", // Affected by cobblestone multipliers
            },
        ],
        hp: 250,
        effective_tool: "pickaxe",
    },
    iron: {
        name: "Iron",
        texture: "block:iron_ore",
        lootTable: [
            {
                item: { ...GAME_ITEMS.raw_iron },
                minQuantity: 1,
                maxQuantity: 1,
                chance: 1.0, // Always drops
                resourceType: "iron", // Affected by iron multipliers
            },
            {
                item: { ...GAME_ITEMS.raw_iron },
                minQuantity: 1,
                maxQuantity: 2,
                chance: 0.05, // 5% chance for bonus iron ore
                resourceType: "iron", // Affected by iron multipliers
            },
        ],
        hp: 600,
        effective_tool: "pickaxe",
    },
} as const satisfies Record<string, ResourceData>;
