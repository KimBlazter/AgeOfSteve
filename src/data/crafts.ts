import { Craft } from "@/stores/crafts";
import { GAME_ITEMS } from "./items";

export const crafts = {
    // WOOD AGE
    wooden_axe: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.wooden_axe },
        },
        cost: {
            items: [{ key: "oak_log", amount: 10 }],
        },
    },
    wooden_pickaxe: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.wooden_pickaxe },
        },
        cost: {
            items: [{ key: "oak_log", amount: 10 }],
        },
    },
    wooden_sword: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.wooden_sword },
        },
        cost: {
            items: [{ key: "oak_log", amount: 12 }],
        },
    },
    campfire: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.campfire },
        },
        cost: {
            items: [{ key: "oak_log", amount: 20 }],
        },
    },
    shield: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.shield },
        },
        cost: {
            items: [{ key: "oak_log", amount: 15 }],
        },
    },
    log_pile: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.log_pile },
        },
        cost: {
            items: [{ key: "oak_log", amount: 30 }],
        },
    },

    // STONE AGE
    stone_axe: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.stone_axe },
        },
        cost: {
            items: [
                { key: "cobblestone", amount: 15 },
                { key: "oak_log", amount: 5 },
                { key: "wooden_axe" },
            ],
        },
    },
    stone_pickaxe: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.stone_pickaxe },
        },
        cost: {
            items: [
                { key: "cobblestone", amount: 15 },
                { key: "wooden_pickaxe" },
            ],
        },
    },
    stone_sword: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.stone_sword },
        },
        cost: {
            items: [
                { key: "cobblestone", amount: 20 },
                { key: "wooden_sword" },
            ],
        },
    },
    leather_boots: {
        result: {
            qty: 1,
            item: { ...GAME_ITEMS.leather_boots },
        },
        cost: {
            items: [{ key: "cobblestone", amount: 10 }],
        },
    },

    // CONSUMABLES
    watermelon: {
        result: {
            item: { ...GAME_ITEMS.watermelon },
            qty: 2,
        },
        cost: {
            items: [],
        },
    },
} satisfies Record<string, Craft>;
