import { StateCreator } from "zustand";
import { produce } from "immer";
import { upgrades } from "@/data/upgrade";
import { GameStore } from "./game";
import { AgeKey } from "./ages";
import { GameItemKey, GAME_ITEMS } from "@/data/items";

export interface Upgrade {
    name: string;
    description?: string;
    cost: { item: GameItemKey; amount: number };
    unlocked: boolean;
    effect: (gs: GameStore) => void;
    ageRequirement?: AgeKey;
}

export type UpgradeKey = keyof typeof upgrades;

export interface UpgradeSlice {
    upgrades: Record<UpgradeKey, Upgrade>;
    unlockUpgrade: (id: UpgradeKey) => void;
}

export const createUpgradeSlice: StateCreator<
    GameStore,
    [],
    [],
    UpgradeSlice
> = (set, get) => ({
    upgrades: upgrades,
    unlockUpgrade: (upgradeId) => {
        const upgrade = get().upgrades[upgradeId];
        if (!get().hasItem(upgrade.cost.item, upgrade.cost.amount)) return;

        get().removeItem(
            { ...GAME_ITEMS[upgrade.cost.item] },
            upgrade.cost.amount
        );
        upgrade.effect(get());
        // set the upgrade to unlocked
        set(
            produce((state: UpgradeSlice) => {
                state.upgrades[upgradeId].unlocked = true;
            })
        );
    },
});
