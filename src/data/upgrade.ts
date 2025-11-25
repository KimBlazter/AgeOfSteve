import { Upgrade } from "@/stores/upgrades";

export const upgrades = {
    /*
    WOOD AGE
    */
    "upgrade.wood.big_biceps": {
        name: "Big Biceps",
        description: "wood +1",
        cost: { item: "oak_log", amount: 10 },
        effect: (gameStore) =>
            gameStore.updateMultiplier("wood", (prev) => prev + 1),
        unlocked: false,
    },
    "unlock.stone": {
        name: "Ready to get high",
        description: "Unlock the Stone Age",
        cost: { item: "oak_log", amount: 10 },
        effect: (gameStore) => gameStore.unlockAge("stone"),
        unlocked: false,
    },

    /*
    STONE AGE
    */
    "unlock.iron": {
        name: "Harder than ever",
        description: "Unlock the Iron Age",
        cost: { item: "cobblestone", amount: 20 },
        effect: (gameStore) => gameStore.unlockAge("iron"),
        unlocked: false,
        ageRequirement: "stone",
    },
} satisfies Record<string, Upgrade>;
