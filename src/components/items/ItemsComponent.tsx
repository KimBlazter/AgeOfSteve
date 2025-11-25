import ItemComponent from "./ItemComponent";
import { useGameStore } from "@/stores/game";
import { useRef, useState, useEffect } from "react";

export default function ItemsComponent() {
    const items = useGameStore((state) => state.items);
    const containerRef = useRef<HTMLDivElement>(null);
    const [totalSlots, setTotalSlots] = useState(80);

    useEffect(() => {
        const calculateSlots = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Item slot size is 48px (size-12 in Tailwind)
            const slotSize = 48;

            const slotsPerRow = Math.floor(containerWidth / slotSize);
            const rows = Math.floor(containerHeight / slotSize);
            const slots = slotsPerRow * rows;

            setTotalSlots(Math.max(slots, items.length));
        };

        calculateSlots();

        const resizeObserver = new ResizeObserver(calculateSlots);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [items.length]);

    const emptySlotsCount = Math.max(0, totalSlots - items.length);

    return (
        <div className="flex h-full flex-col">
            <h2 className="text-mcInventoryText text-lg font-bold">
                Inventory
            </h2>
            <div
                ref={containerRef}
                className="grid auto-rows-[48px] grid-cols-[repeat(auto-fill,48px)] gap-0 overflow-y-auto pt-1"
            >
                {items.map((item) => (
                    <ItemComponent key={item.instanceId} item={item} />
                ))}
                {/* Empty slots */}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={idx} className="item-slot" />
                ))}
            </div>
        </div>
    );
}
