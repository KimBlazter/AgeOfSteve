import { useGameStore } from "@/stores/game";
import { useState } from "react";
import ItemIcon from "@/components/ItemIcon";
import clsx from "clsx";
import { FloatingNumbers, useFloatingNumbers } from "../../ui/FloatingNumbers";
import ProgressBar from "@/components/ui/ProgressBar";
import ProgressCounter from "@/components/ui/ProgressCounter";
import { Tooltip } from "@/components/ui/Tooltip";
import MineResourceContent from "@/components/Tooltips/MineResourceContent";

export default function MineResourceButton() {
    const resource = useGameStore(
        (state) => state.ages[state.currentAge].collectible
    );
    const resourceData = useGameStore((state) => state.resources[resource]);
    const mineResource = useGameStore((state) => state.mineResource);

    const currentResourceHealth = useGameStore(
        (state) => state.miningResources[resource].current_hp
    );

    const [isClicked, setIsClicked] = useState(false);

    // Use the custom hook for floating numbers
    const { numbers, spawnNumber, removeNumber } = useFloatingNumbers();

    const handleMine = async () => {
        // Trigger click animation
        setIsClicked(true);
        const { damageDealt, critical } = mineResource(resource);
        setTimeout(() => setIsClicked(false), 75);

        spawnNumber(
            damageDealt.toString(),
            Math.random() * 100,
            Math.random() * 100,
            {
                color: critical ? "orange" : "white",
                size: critical ? 2 : 1.25,
                borderColor: "rgba(0, 0, 0, 0.8)",
                borderWidth: 2,
            }
        );
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="dialog-border-transparent bg-mcInventoryBackground/50! relative flex size-20 items-center justify-center">
                <button
                    className="h-full w-full bg-transparent! p-1!"
                    onClick={handleMine}
                    style={{
                        border: "none",
                    }}
                >
                    <ItemIcon
                        texture={resourceData.texture}
                        className={clsx(
                            "[&_img]:image-auto! transition-all duration-200 hover:scale-90",
                            isClicked ? "scale-110" : "scale-80"
                        )}
                        style={
                            isClicked ?
                                {
                                    transform: `scale(1.2) rotate(${Math.random() * 20 - 10}deg)`,
                                    transition:
                                        "all 0.1s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                                    filter: `brightness(${1.1 + Math.random() * 0.4}) saturate(${1.0 + Math.random() * 0.5})`,
                                }
                            :   {
                                    transition: "all 0.2s ease-out",
                                }
                        }
                    />
                </button>
                <FloatingNumbers
                    numbers={numbers}
                    onNumberComplete={removeNumber}
                />

                {/* Health bar */}
                <div className="absolute -top-9 left-1/2 flex w-full -translate-x-1/2 flex-col">
                    <ProgressCounter
                        value={currentResourceHealth}
                        maxValue={resourceData.hp}
                        className="text-center text-sm leading-5 font-bold tracking-wider text-white"
                        style={{
                            transform: isClicked ? "scale(0.8)" : "scale(1)",
                        }}
                    />
                    <ProgressBar
                        value={currentResourceHealth}
                        maxValue={resourceData.hp}
                        style={{
                            transform: isClicked ? "scaleX(0.8)" : "scaleX(1)",
                            transformOrigin: "center",
                        }}
                    />
                </div>

                {/* Info Button */}
                <div className="absolute top-0 -right-6.5 flex w-7! flex-col">
                    <Tooltip
                        content={
                            <MineResourceContent resourceData={resourceData} />
                        }
                        position="right"
                        align="start"
                    >
                        <div className="ml-1 flex size-6 items-center justify-center border-2 border-black bg-black/40! p-1">
                            ?
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
