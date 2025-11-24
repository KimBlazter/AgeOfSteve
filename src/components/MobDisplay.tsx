import { useState, useEffect } from "react";
import getTexture, { Texture } from "@/utils/spriteLoader";
import clsx from "clsx";

export default function MobDisplay({
    texture,
    className,
    style,
    size = 1,
    isDamaged = false,
}: {
    texture?: Texture;
    className?: string;
    style?: React.CSSProperties;
    size?: number; // Size multiplier for the mob display
    isDamaged?: boolean; // Whether the mob is taking damage
}) {
    const [textureDataURL, setTextureDataURL] = useState<string | null>(null);

    useEffect(() => {
        if (texture) {
            getTexture(texture)
                .then((data) => {
                    setTextureDataURL(data.texture);
                })
                .catch((error) => {
                    console.error(
                        `Failed to load texture for ${texture}:`,
                        error
                    );
                });
        }
    }, [texture]);

    if (textureDataURL) {
        return (
            <div
                className={clsx(
                    "relative flex justify-end select-none",
                    className
                )}
                style={style}
            >
                <img
                    src={textureDataURL}
                    alt=""
                    className="h-full w-full"
                    draggable={false}
                    style={{
                        imageRendering: "pixelated",
                        transform: `scale(${size})`,
                        transformOrigin: "bottom center",
                    }}
                />
                {/* Red damage overlay */}
                {isDamaged && (
                    <div
                        className="image-pixelated pointer-events-none absolute"
                        style={{
                            backgroundColor: "rgba(249, 45, 45, 0.6)",
                            transform: `scale(${size})`,
                            transformOrigin: "bottom center",
                            transition: "all 0.15s ease-in-out",
                            mixBlendMode: "color",
                            mask: `url(${textureDataURL})`,
                            maskSize: "calc(100% - 6px) calc(100% - 6px)",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            WebkitMask: `url(${textureDataURL})`,
                            WebkitMaskSize: "calc(100% - 6px) calc(100% - 6px)",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            animation: "damageFlash 0.3s ease-out",
                            top: "2px",
                            left: "2px",
                            right: "2px",
                            bottom: "2px",
                        }}
                    />
                )}
            </div>
        );
    } else {
        return <div>No image</div>;
    }
}
