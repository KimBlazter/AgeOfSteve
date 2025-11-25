import { useGameStore } from "@/stores/game";
import { Upgrade, UpgradeKey } from "@/stores/upgrades";
import clsx from "clsx";
import { Tooltip } from "../ui/Tooltip";

export default function UpgradeComponent({
    upgradeKey,
    upgrade,
}: {
    upgradeKey: UpgradeKey;
    upgrade: Upgrade;
}) {
    const unlockUpgrade = useGameStore((state) => state.unlockUpgrade);
    const hasItem = useGameStore((state) => state.hasItem);
    const itemCount = useGameStore((state) =>
        state.getItemCount(upgrade.cost.item)
    );

    const hasEnough = hasItem(upgrade.cost.item, upgrade.cost.amount);

    return (
        <Tooltip
            content={<div>{upgrade.description}</div>}
            position="left"
            align="start"
        >
            <button
                disabled={upgrade.unlocked}
                className="flex w-full flex-col bg-gray-600!"
                onClick={() => {
                    unlockUpgrade(upgradeKey);
                }}
            >
                {upgrade.name}
                {!upgrade.unlocked && (
                    <span className="text-sm text-gray-300 text-shadow-none">
                        {upgrade.cost.item}: {upgrade.cost.amount}{" "}
                        <span
                            className={clsx(
                                "mc-text-shadow",
                                hasEnough ? "text-green-400" : "text-red-400"
                            )}
                        >
                            ({itemCount})
                        </span>
                    </span>
                )}
            </button>
        </Tooltip>
    );
}
