import { GAME_ITEMS, GameItemKey } from "@/data/items";
import { Craft } from "@/stores/crafts";
import { useGameStore } from "@/stores/game";
import clsx from "clsx";
import ItemIcon from "@components/ItemIcon";
import ToolDescription from "./item/ToolDescription";
import ItemTypeBadge from "./ui/ItemTypeBadge";
import ItemDescription from "./ui/ItemDescription";
import WeaponDescription from "./item/WeaponDescription";
import ConsumableDescription from "./item/ConsumableDescription";

export default function CraftTooltipContent({ craft }: { craft: Craft }) {
    const hasItem = useGameStore((state) => state.hasItem);

    return (
        <div>
            <div className="flex flex-col">
                <span className="text-base text-amber-400">
                    {craft.result.item.name}
                </span>

                <ItemTypeBadge item={craft.result.item} className="mb-1" />

                <div className="flex flex-col gap-3">
                    {craft.result.item.type === "tool" && (
                        <ToolDescription
                            item={craft.result.item}
                            equiped={true}
                        />
                    )}

                    {craft.result.item.type === "weapon" && (
                        <WeaponDescription item={craft.result.item} />
                    )}

                    {/* Consumable stats */}
                    {craft.result.item.type === "consumable" && (
                        <ConsumableDescription
                            item={craft.result.item}
                            className="mt-1"
                        />
                    )}

                    {/* Description */}
                    <ItemDescription item={craft.result.item} />
                </div>

                {/* Horizontal Separator */}
                <hr className="my-2 border-t border-white/60" />

                {/* Crafting Cost */}
                <div className="flex flex-col">
                    {/* Cost */}
                    <span className="-mb-1 flex flex-row items-center">
                        cost:{" "}
                        <div className="ml-1 flex flex-row items-center gap-1">
                            {/* Item */}
                            {craft.cost.items?.map((item) => (
                                <span
                                    key={item.key}
                                    className={clsx(
                                        "flex flex-row items-center",
                                        hasItem(item.key, item.amount) ?
                                            "text-green-400"
                                        :   "text-red-400"
                                    )}
                                >
                                    {item.amount ?? 1}
                                    <ItemIcon
                                        className="[&_img]:image-auto! ml-0.5 size-7"
                                        texture={
                                            GAME_ITEMS[item.key as GameItemKey]
                                                .texture
                                        }
                                    />
                                </span>
                            ))}
                        </div>
                        {craft.cost.items?.length === 0 && (
                            <span className="text-green-400">Free</span>
                        )}
                    </span>

                    {/* Result */}
                    <span className={"flex flex-row items-center"}>
                        result: {craft.result.qty}
                        <ItemIcon
                            texture={craft.result.item.texture}
                            className="[&_img]:image-auto! size-7"
                        />
                    </span>
                </div>

                <p className="mt-2 text-white/50">
                    Craft a{" "}
                    <span className="text-amber-400 lowercase">
                        {craft.result.item.name}
                    </span>
                </p>
            </div>
        </div>
    );
}
