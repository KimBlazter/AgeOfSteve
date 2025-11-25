import ItemsComponent from "@/components/items/ItemsComponent";

export default function InventoryComponent() {
    return (
        <div className="inventory-border text-mcInventoryText flex h-full flex-row gap-2">
            {/* Items */}
            <div className="h-full w-full">
                <ItemsComponent />
            </div>
        </div>
    );
}
