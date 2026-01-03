import { Item } from "@/stores/items";
import Select, { components } from "react-select";
import type { DropdownIndicatorProps, StylesConfig } from "react-select";
import ItemIcon from "../ItemIcon";
import { Texture } from "@/utils/spriteLoader";
import { useGameStore } from "@/stores/game";

type ItemTypeOption = Record<Item["type"] | "all", string>;

const ITEM_TYPES: ItemTypeOption = {
    all: "All Types",
    weapon: "Weapons",
    armor: "Armor",
    consumable: "Consumables",
    tool: "Tools",
    generic: "Generic",
    resource: "Resources",
};

const TYPE_ICONS: Record<Item["type"] | "all", Texture> = {
    all: "block:chest_block",
    weapon: "item:wooden_sword",
    armor: "item:diamond_chestplate",
    consumable: "item:rotten_flesh",
    tool: "item:wooden_axe",
    generic: "item:bundle",
    resource: "block:oak_log",
};

type SelectOption = {
    value: Item["type"] | "all";
    label: string;
    icon: Texture;
};

const options: SelectOption[] = Object.entries(ITEM_TYPES).map(
    ([value, label]) => ({
        value: value as Item["type"] | "all",
        label,
        icon: TYPE_ICONS[value as Item["type"] | "all"],
    })
);

const DropdownIndicator = (
    props: DropdownIndicatorProps<SelectOption, false>
) => {
    return (
        <components.DropdownIndicator {...props} className="mr-1">
            &#x23F7;
        </components.DropdownIndicator>
    );
};

const IndicatorSeparator = () => null;

const selectStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "rgba(75, 85, 99, 0.5)",
        cursor: "pointer",
        minWidth: "150px",
        boxShadow: "none",
        outline: "none",
        borderColor:
            state.isFocused
                ? "rgba(55, 65, 81, 0.8)"
                : "rgba(55, 65, 81, 0.8)",
        "&:hover": {
            borderColor: "rgba(55, 65, 81, 0.8)",
        },
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "#374151",
        border: "2px solid #1f2937",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor:
            state.isSelected ? "#4b5563"
            : state.isFocused ? "#4b5563"
            : "#374151",
        cursor: "pointer",
        color: "#fff",
    }),
    singleValue: (base) => ({
        ...base,
        color: "#fff",
    }),
};

export default function ItemFilterComponent() {
    const filters = useGameStore((state) => state.filters);
    const setFilters = useGameStore((state) => state.setFilters);

    // Synchronize selectedOption with the store's filter
    const selectedOption =
        options.find((opt) => opt.value === (filters.type || "all")) ||
        options[0];

    const handleTypeChange = (option: SelectOption | null) => {
        if (option) {
            setFilters({
                type: option.value === "all" ? undefined : option.value,
            });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            search: e.target.value || undefined,
        });
    };

    // Handle Escape key to clear focus
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            e.currentTarget.blur();
        }
    };

    const clearSearch = () => {
        setFilters({
            search: undefined,
        });
    };

    return (
        <div className="flex flex-row gap-2 text-sm">
            <div className="relative flex flex-row">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={filters.search || ""}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="dialog-border-transparent h-full bg-gray-600/50 px-3 py-1.5 pr-8 text-sm text-white outline-none placeholder:text-gray-300"
                />
                {filters.search && (
                    <div
                        onClick={() => {
                            clearSearch();
                        }}
                        className="dialog-border-transparent absolute right-0 flex aspect-square h-full cursor-pointer items-center justify-center bg-red-500 p-1 text-white"
                    >
                        x
                    </div>
                )}
            </div>
            <Select
                value={selectedOption}
                onChange={handleTypeChange}
                options={options}
                components={{ DropdownIndicator, IndicatorSeparator }}
                formatOptionLabel={(option: SelectOption) => (
                    <div className="flex items-center gap-2" key={option.value}>
                        <ItemIcon
                            texture={option.icon}
                            className="[&_img]:image-auto! aspect-square size-5 p-0!"
                        />
                        <span>{option.label}</span>
                    </div>
                )}
                className="dialog-border-transparent text-sm"
                styles={selectStyles}
            />
        </div>
    );
}
