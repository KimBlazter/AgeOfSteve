import clsx from "clsx";
import { ReactNode, useState } from "react";
import ItemIcon from "../ItemIcon";
import { Texture } from "@/utils/spriteLoader";
import { Tooltip } from "./Tooltip";

namespace TabSwitcher {
    export type Tab = {
        title: string;
        icon?: Texture;
        backgroundImage?: string;
        content: ReactNode;
    };

    export interface Props {
        tabs: Tab[];
        defautTab?: number;
        className?: string;
    }
}

export default function TabSwitcher(props: TabSwitcher.Props) {
    const [currentTab, setCurrentTab] = useState<number>(props.defautTab ?? 0);
    return (
        <div className={clsx("flex w-full flex-col", props.className)}>
            {/* Tabs */}
            <div className="-mb-3 flex flex-row items-center">
                {props.tabs.map((tab, index) => (
                    // Tab
                    <div
                        key={index}
                        onClick={() => setCurrentTab(index)}
                        className={clsx(
                            "inventory-border relative border-b-0 pb-3",
                            currentTab === index ? "z-6" : "brightness-85"
                        )}
                    >
                        <div className="flex w-full flex-row items-center">
                            <Tooltip
                                key={index}
                                content={tab.title}
                                position="top"
                            >
                                <ItemIcon texture={tab.icon} className="h-10" />
                            </Tooltip>

                            {/* <span className="h-auto text-black">
                                {tab.title}
                            </span> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab content */}
            <div className="inventory-border z-5 h-full w-full">
                <div className="bg-mcInventoryBackground h-full w-full">
                    {props.tabs[currentTab].content}
                </div>
            </div>
        </div>
    );
}
