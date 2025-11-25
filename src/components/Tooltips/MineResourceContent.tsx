import { useGameStore } from "@/stores/game";
import { ResourceData } from "@/stores/resources";
import { formatNumber } from "@/utils/number-formatting-compact";
import ItemIcon from "../ItemIcon";
import { TextureId } from "@/utils/spriteLoader";

export default function MineResourceContent({
    resourceData,
}: {
    resourceData: ResourceData;
}) {
    const resource = useGameStore(
        (state) => state.ages[state.currentAge].collectible
    );
    const currentHp = useGameStore(
        (state) => state.miningResources[resource].current_hp
    );
    const equippedTool = useGameStore(
        (state) => state.equipments[resourceData.effective_tool]
    );
    const computeResourcesYield = useGameStore(
        (state) => state.computeResourcesYield
    );

    // Mining damage logic mirrors stores/mining.ts
    const baseHandsDamage = 10; // keep in sync with mining slice
    const usingTool = equippedTool && equippedTool.type === "tool";
    const isOptimalTool =
        equippedTool?.type === "tool" &&
        equippedTool.toolType === resourceData.effective_tool;
    const miningDamage = usingTool ? equippedTool.damage : baseHandsDamage;

    return (
        <div className="mc-text-shadow letter-sp flex min-w-56 flex-col gap-1 text-base tracking-normal">
            {/* Title */}
            <div className="flex items-center justify-between gap-4">
                <span className="text-amber-400">{resourceData.name}</span>
            </div>

            {/* Health and hits to break */}
            <div className="flex items-center justify-between text-xs text-white/70">
                <span>
                    <span className="text-white/60">HP</span>
                    <span className="ml-1 text-green-300">
                        {formatNumber(currentHp)}
                    </span>
                    <span className="mx-1 text-white/45">/</span>
                    <span className="text-slate-300/90">
                        {formatNumber(resourceData.hp)}
                    </span>
                </span>
            </div>

            {/* Loot Table */}
            <div className="mt-0.5 flex w-2/3 flex-col">
                <span className="text-[11px] text-white/60">
                    Drops per break:
                </span>
                <div className="rounded-md bg-gray-600/80 p-1">
                    {resourceData.lootTable.map((drop, index) => {
                        const hasResourceType =
                            "resourceType" in drop && drop.resourceType;
                        const multiplier =
                            hasResourceType && drop.resourceType ?
                                computeResourcesYield(drop.resourceType)
                            :   1;
                        const minQty = Math.floor(
                            drop.minQuantity * multiplier
                        );
                        const maxQty = Math.floor(
                            drop.maxQuantity * multiplier
                        );

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between text-[11px]"
                            >
                                <div className="flex items-center gap-1">
                                    <ItemIcon
                                        texture={drop.item.texture}
                                        className="size-6"
                                    />
                                    <span className="text-white/80">
                                        {drop.item.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-green-400">
                                        {minQty === maxQty ?
                                            `${minQty}`
                                        :   `${minQty}-${maxQty}`}
                                    </span>
                                    <span className="text-white/40">
                                        ({Math.round(drop.chance * 100)}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tool effectiveness */}
            <div className="mt-1 flex items-center justify-between text-xs text-white/70">
                <div className="flex items-center gap-1">
                    <span className="text-white/70">Best tool:</span>
                    <ItemIcon
                        className="-m-2 size-6 text-white opacity-30 brightness-0 invert-100"
                        texture={
                            ("item:iron_" +
                                resourceData.effective_tool) as TextureId
                        }
                    />
                </div>
            </div>

            {/* Current mining power */}
            <div className="flex items-center justify-between text-xs text-white/70">
                <span>
                    Equipped:
                    {usingTool ?
                        <span
                            className={
                                isOptimalTool ? "text-green-300" : (
                                    "text-yellow-300"
                                )
                            }
                        >
                            {equippedTool!.name}
                        </span>
                    :   <span className="text-rose-300">Bare hands</span>}
                </span>
                <span>
                    <span className={"text-amber-300"}>
                        {miningDamage}
                        <span className="text-white/40">/click</span>
                    </span>
                </span>
            </div>

            {/* Crit note */}
            <div className="mt-0.5 text-[11px] leading-4 text-white/50">
                5% chance to deal{" "}
                <span className="text-red-400">critical hit</span> (x2 damage)
            </div>
        </div>
    );
}
