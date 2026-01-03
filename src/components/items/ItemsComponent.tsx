import ItemComponent from "./ItemComponent";
import { useGameStore } from "@/stores/game";
import { useRef, useState, useEffect, useMemo } from "react";
import ItemFilterComponent from "./ItemFilterComponent";

export default function ItemsComponent() {
    const itemsRaw = useGameStore((s) => s.items);
    const filters = useGameStore((s) => s.filters);

    // Compute filtered items outside of the store
    const items = useMemo(() => {
        return itemsRaw.filter((item) => {
            // search
            if (
                filters.search &&
                filters.search !== "all" &&
                !item.name.toLowerCase().includes(filters.search.toLowerCase())
            )
                return false;

            // type
            if (
                filters.type &&
                filters.type !== "all" &&
                item.type !== filters.type
            )
                return false;

            return true;
        });
    }, [itemsRaw, filters]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [totalSlots, setTotalSlots] = useState(80);

    useEffect(() => {
        const calculateSlots = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const slotSize = 48;

            const slotsPerRow = Math.floor(containerWidth / slotSize);
            const rows = Math.floor(containerHeight / slotSize);
            const slots = slotsPerRow * rows;

            setTotalSlots(Math.max(slots, items.length));
        };

        calculateSlots();

        const resizeObserver = new ResizeObserver(calculateSlots);
        resizeObserver.observe(containerRef.current!);

        return () => resizeObserver.disconnect();
    }, [items.length]);

    const emptySlotsCount = Math.max(0, totalSlots - items.length);

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-row justify-between">
                <h2 className="text-mcInventoryText text-lg font-bold">
                    Inventory
                </h2>
                <ItemFilterComponent />
            </div>

            <div
                ref={containerRef}
                className="grid auto-rows-[48px] grid-cols-[repeat(auto-fill,48px)] gap-0 overflow-y-auto pt-1"
            >
                {items.map((item) => (
                    <ItemComponent key={item.instanceId} item={item} />
                ))}

                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={idx} className="item-slot" />
                ))}
            </div>
        </div>
    );
}
