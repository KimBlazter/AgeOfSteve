import { StateCreator } from "zustand";
import { Resource } from "./resources";
import { produce } from "immer";
import { GameStore } from "./game";
import { ItemEffect } from "./items";

export interface Bonus {
    baseGain: number;
    multiplier: number;
}
type ResourceBonus = Record<Resource, Bonus>;

export interface TimedBonus {
    multiplier?: number;
    baseGain?: number;
    createdAt: string; // timestamp ISO string
    expiresAt: string; // timestamp ISO string /!\ important /!\
    source?: string; // e.g., "powerup", "skill", "item"
    effectMetadata?: ItemEffect; // Metadata for the effect, if applicable
}
type ResourceTimedBonus = Record<Resource, TimedBonus[]>;

export interface BonusSlice {
    permanentBonuses: ResourceBonus;
    timedBonuses: ResourceTimedBonus;
    updateMultiplier: (
        resource: Resource,
        value: number | ((current: number) => number)
    ) => void;
    updateBaseGain: (
        resource: Resource,
        value: number | ((current: number) => number)
    ) => void;
    addTimedBonus: (resource: Resource, bonus: TimedBonus) => void;
    cleanupExpiredBonuses: () => void; // This function should handle the removal of expired modifiers
    computeResourcesYield: (resource: Resource) => number;
}

export const createBonusSlice: StateCreator<GameStore, [], [], BonusSlice> = (
    set,
    get
) => ({
    permanentBonuses: {
        wood: { baseGain: 1, multiplier: 1 },
        cobblestone: { baseGain: 1, multiplier: 1 },
        iron: { baseGain: 1, multiplier: 1 },
    },
    timedBonuses: {
        wood: [],
        cobblestone: [],
        iron: [],
    },
    updateBaseGain: (resource, value) =>
        set(
            produce((state: BonusSlice) => {
                state.permanentBonuses[resource].baseGain =
                    typeof value == "number" ? value : (
                        value(state.permanentBonuses[resource].baseGain)
                    );
            })
        ),
    updateMultiplier: (resource, value) =>
        set(
            produce((state: BonusSlice) => {
                state.permanentBonuses[resource].multiplier =
                    typeof value == "number" ? value : (
                        value(state.permanentBonuses[resource].multiplier)
                    );
            })
        ),
    addTimedBonus: (resource, bonus) => {
        const bonusExistsIndex = get().timedBonuses[resource].findIndex(
            (b) => b.source === bonus.source
        );
        if (bonusExistsIndex === -1) {
            // If no bonus with the same source already
            set(
                produce((state: BonusSlice) => {
                    state.timedBonuses[resource].push(bonus);
                })
            );
        } else {
            set(
                produce((state: BonusSlice) => {
                    // If a bonus with the same source exists, update it
                    state.timedBonuses[resource][bonusExistsIndex].expiresAt =
                        bonus.expiresAt;
                    state.timedBonuses[resource][bonusExistsIndex].createdAt =
                        bonus.createdAt;
                })
            );
        }
    },
    cleanupExpiredBonuses: () =>
        set(
            produce((state: BonusSlice) => {
                Object.entries(state.timedBonuses).forEach(
                    ([resource, bonuses]) => {
                        bonuses.forEach((bonus) => {
                            if (new Date(bonus.expiresAt) < new Date()) {
                                // Remove expired bonus
                                state.timedBonuses[resource as Resource] =
                                    state.timedBonuses[
                                        resource as Resource
                                    ].filter((b) => b !== bonus);
                            }
                        });
                    }
                );
            })
        ),
    computeResourcesYield: (resource) => {
        const state = get();
        // Ensure all the bonuses are cleaned up before computing the yield
        state.cleanupExpiredBonuses();

        const activeTimedBonuses = state.timedBonuses[resource];

        // Compute flat bonus (base + temporaries)
        const totalFlatBonus =
            state.permanentBonuses[resource].baseGain +
            activeTimedBonuses.reduce(
                (acc, timedBonus) => acc + (timedBonus.baseGain ?? 0),
                0
            );

        // Compute multiplier (base * temporaries)
        const totalMultiplier =
            state.permanentBonuses[resource].multiplier *
            activeTimedBonuses.reduce(
                (acc, timedBonus) => acc * (timedBonus.multiplier ?? 1),
                1
            );

        return totalFlatBonus * totalMultiplier;
    },
});
