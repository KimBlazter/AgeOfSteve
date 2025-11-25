import { CraftKey } from "@/stores/crafts";
import { Tooltip } from "@/components/ui/Tooltip";
import { useGameStore } from "@/stores/game";
import CraftTooltipContent from "@/components/Tooltips/CraftTooltipContent";
import ItemIcon from "@/components/ItemIcon";

export default function CraftComponent({ craftId }: { craftId: CraftKey }) {
    const craft = useGameStore((state) => state.crafts[craftId]);
    const craftAction = useGameStore((state) => state.craft);
    return (
        <Tooltip
            content={<CraftTooltipContent craft={craft} />}
            align="end"
            position="top"
        >
            <div
                className="item-slot relative flex items-center justify-center text-xs"
                onClick={() => craftAction(craftId)}
            >
                <ItemIcon texture={craft.result.item.texture} />
            </div>
        </Tooltip>
    );
}
