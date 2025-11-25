import { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import {
    useFloating,
    flip,
    shift,
    offset,
    Placement,
    autoUpdate,
} from "@floating-ui/react-dom";

type TooltipProps = {
    children: ReactNode;
    content: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    position?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
};

export function Tooltip({
    children,
    content,
    className,
    style,
    position = "top",
    align = "center",
}: TooltipProps) {
    const [visible, setVisible] = useState(false);

    // Convert props to floating-ui placement string
    const placement: Placement = (() => {
        // ex: top-start, right-end…
        const side = position;
        const alignSuffix = align === "center" ? "" : `-${align}`; // "center" = no suffix
        return (side + alignSuffix) as Placement;
    })();

    const { refs, floatingStyles } = useFloating({
        placement,
        middleware: [offset(8), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    return (
        <>
            <div
                ref={refs.setReference}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className={clsx("inline-flex", className)}
                style={style}
            >
                {children}
            </div>

            {visible &&
                ReactDOM.createPortal(
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className={clsx(
                            "tooltip-border z-50 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg transition-opacity",
                            visible ? "opacity-100" : "opacity-0",
                            content ? "" : "hidden"
                        )}
                    >
                        {content}
                    </div>,
                    document.body
                )}
        </>
    );
}
