import { useGameStore } from "@/stores/game";
import { useModalStore } from "@/stores/modals";
import { HotkeySettingsData } from "@/stores/settings";
import { saveToLocalStorage } from "@/utils/save";

export const hotkeys = {
    mineCurrent: {
        hotkey: "M",
        action: () => {
            const gameStore = useGameStore.getState();
            const resource = gameStore.ages[gameStore.currentAge].collectible;
            const lootTable = gameStore.resources[resource].lootTable;

            // Process each drop in the loot table
            lootTable.forEach((drop) => {
                if (Math.random() <= drop.chance) {
                    const quantity = Math.floor(
                        Math.random() *
                            (drop.maxQuantity - drop.minQuantity + 1) +
                            drop.minQuantity
                    );

                    // Apply resource multiplier only if this drop has a matching resourceType
                    let finalQuantity = quantity;
                    if ("resourceType" in drop && drop.resourceType) {
                        const multiplier = gameStore.computeResourcesYield(
                            drop.resourceType
                        );
                        finalQuantity = Math.floor(quantity * multiplier);
                    }

                    if (finalQuantity > 0) {
                        gameStore.addItem(drop.item, finalQuantity);
                    }
                }
            });
        },
    },
    openAchievements: {
        hotkey: "A",
        action: () => useModalStore.getState().toggle("achievements-modal"),
    },
    saveGame: {
        hotkey: "S",
        action: () => {
            saveToLocalStorage();
        },
    },
    openSettings: {
        hotkey: "P",
        action: () => useModalStore.getState().toggle("settings-modal"),
    },
} satisfies Record<string, HotkeySettingsData>;
