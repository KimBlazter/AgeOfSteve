import ItemIcon from "@/components/ItemIcon";
import { Item } from "@/stores/items";
import { TextureId } from "@/utils/spriteLoader";
import clsx from "clsx";

export default function ItemTypeBadge({
    item,
    className,
}: {
    item: Item;
    className?: string;
}) {
    return (
        <span
            className={clsx(
                "flex flex-row items-center gap-1 text-sm text-white/30",
                className
            )}
        >
            <span className="flex items-center justify-center rounded-sm bg-white/60 px-2 pb-0.5 leading-4 text-black capitalize text-shadow-none">
                {item.type}
            </span>
            {item.type === "tool" && (
                <span className="flex items-center justify-center gap-1 rounded-sm bg-white/60 px-0.5 py-0.5 text-black text-shadow-none">
                    <ItemIcon
                        className="size-4 p-0! brightness-0"
                        texture={("item:iron_" + item.toolType) as TextureId}
                    />
                </span>
            )}
        </span>
    );
}
