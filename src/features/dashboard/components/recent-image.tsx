"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageIcon, Gamepad2, Disc3, Cable } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecentItem } from "../contracts";
export function RecentImage({
  photo,
  variant = "thumbnail",
  type = "GAME",
  showStatus = true,
}: {
  photo: RecentItem["photo"];
  variant?: "thumbnail" | "card";
  type?: RecentItem["type"];
  showStatus?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const Icon =
    type === "CONSOLE" ? Gamepad2 : type === "ACCESSORY" ? Cable : Disc3;
  return (
    <div
      className={cn("recent-image", variant === "card" && "recent-image-large")}
    >
      {photo && failed !== photo.url ? (
        <Image
          unoptimized
          src={photo.url}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          className="size-full object-contain"
          loading={variant === "card" ? "eager" : "lazy"}
          onError={() => setFailed(photo.url)}
        />
      ) : (
        <span className="recent-image-fallback">
          {variant === "card" ? (
            <Icon aria-hidden="true" />
          ) : (
            <ImageIcon aria-hidden="true" />
          )}
          {showStatus && <span>{photo ? "Unavailable" : "No photo"}</span>}
        </span>
      )}
    </div>
  );
}
