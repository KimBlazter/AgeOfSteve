import { Item } from "@/stores/items";
import ToolDescription from "./ToolDescription";
import WeaponDescription from "./WeaponDescription";
import ItemTypeBadge from "../ui/ItemTypeBadge";
import ItemDescription from "../ui/ItemDescription";
import ConsumableDescription from "./ConsumableDescription";

export default function ItemTooltipContent({
    item,
    equiped = false,
}: {
    item: Item;
    equiped?: boolean;
}) {
    return (
        <div className="mc-text-shadow letter-sp flex flex-col text-base tracking-normal">
            <div className="flex flex-col">
                <span className="mb-0.5 text-base text-amber-400">
                    {item.name}
                </span>
                <ItemTypeBadge item={item} className="mb-1" />

                {/* Tool stats */}
                {item.type === "tool" && (
                    <ToolDescription item={item} equiped={equiped} />
                )}

                {/* Weapon stats */}
                {item.type === "weapon" && <WeaponDescription item={item} />}

                {/* Consumable stats */}
                {item.type === "consumable" && (
                    <ConsumableDescription item={item} className="mt-1" />
                )}

                {/* Armor stats */}
                {item.type === "armor" && (
                    <span className="mt-1 text-xs text-white/70">
                        Defense:{" "}
                        <span className="text-blue-400">{item.defense}</span>
                    </span>
                )}

                {/* Horizontal Separator */}
                <hr className="my-2 border-t border-white/60" />

                {/* Description */}
                <ItemDescription item={item} />

                {/* Equip/Unequip message */}
                {(item.type === "tool" ||
                    item.type === "weapon" ||
                    item.type === "armor") && (
                    <span className="mt-4 text-xs tracking-tighter text-white/60">
                        Left click to{" "}
                        <span className="text-gray-300">
                            {equiped ? "unequip" : "equip"}
                        </span>{" "}
                        {item.type}
                    </span>
                )}

                {/* Consume message */}
                {item.type === "consumable" && (
                    <span className="mt-4 text-xs tracking-tighter text-white/60">
                        Left click to{" "}
                        <span className="text-gray-300">consume</span> item
                    </span>
                )}
            </div>
        </div>
    );
}
