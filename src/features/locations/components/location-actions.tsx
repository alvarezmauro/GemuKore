"use client";

import { useId, useState, type ComponentProps } from "react";
import { LayoutGroup, motion } from "motion/react";
import { FolderPlus, Pencil, Trash2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMotionAllowed } from "@/lib/motion/use-motion-preference";
import type { LocationEntry } from "../contracts";
import { LocationForm } from "./location-form";
import { DeleteLocation } from "./delete-location";

const dockSpring = { type: "spring", duration: 0.4, bounce: 0 } as const;

function DockButton({
  label,
  icon: Icon,
  active,
  animated,
  ...props
}: ComponentProps<typeof Button> & {
  label: string;
  icon: LucideIcon;
  active: boolean;
  animated: boolean;
}) {
  return (
    <Button
      {...props}
      variant="ghost"
      className="location-dock-button relative h-11 gap-0 rounded-xl px-3 hover:bg-transparent dark:hover:bg-transparent"
    >
      {active && (
        <motion.span
          aria-hidden="true"
          layoutId={animated ? "highlight" : undefined}
          transition={animated ? dockSpring : { duration: 0 }}
          className="absolute inset-0 rounded-xl bg-accent"
        />
      )}
      <Icon className="relative size-5" aria-hidden="true" />
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ width: active ? "auto" : 0 }}
        transition={animated ? dockSpring : { duration: 0 }}
        className="location-dock-label relative overflow-hidden whitespace-nowrap"
        data-active={active}
      >
        <span className="block pl-2 text-sm">
          {Array.from(label).map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block whitespace-pre"
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                filter: active ? "blur(0px)" : "blur(4px)",
                y: active || !animated ? 0 : 4,
              }}
              transition={
                animated
                  ? { duration: 0.2, delay: active ? index * 0.015 : 0 }
                  : { duration: 0 }
              }
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </motion.span>
    </Button>
  );
}

export function LocationActions({
  location,
  locations,
  onSuccess,
}: {
  location: LocationEntry;
  locations: LocationEntry[];
  onSuccess: (message: string) => void;
}) {
  const id = useId();
  const animated = useMotionAllowed();
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = hovered ?? focused;
  const interaction = (action: string) => ({
    active: active === action,
    animated,
    onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== "touch") setHovered(action);
    },
    onFocus: () => setFocused(action),
    onBlur: () => setFocused(null),
  });
  const occupied = Boolean(location.childCount || location.itemCount);
  return (
    <LayoutGroup id={id}>
      <div
        role="group"
        aria-label={`Actions for ${location.name}`}
        className="location-dock inline-flex shrink-0 items-center gap-1 rounded-2xl border border-border/60 bg-background/60 p-1"
        onPointerLeave={() => setHovered(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setHovered(null);
            setFocused(null);
          }
        }}
      >
        <LocationForm
          location={location}
          locations={locations}
          onSuccess={onSuccess}
          trigger={
            <DockButton
              {...interaction("edit")}
              label="Edit or move"
              icon={Pencil}
              aria-label={`Edit or move ${location.name}`}
            />
          }
        />
        <LocationForm
          parentId={location.id}
          locations={locations}
          onSuccess={onSuccess}
          trigger={
            <DockButton
              {...interaction("child")}
              label="Add child"
              icon={FolderPlus}
              aria-label={`Add child to ${location.name}`}
            />
          }
        />
        <DeleteLocation
          location={location}
          onSuccess={onSuccess}
          trigger={
            <DockButton
              {...interaction("delete")}
              label="Delete"
              icon={Trash2}
              aria-label={`Delete ${location.name}`}
              aria-describedby={occupied ? `${id}-delete-hint` : undefined}
              disabled={occupied}
            />
          }
        />
      </div>
      {occupied && (
        <span id={`${id}-delete-hint`} className="sr-only">
          Move children and items elsewhere to enable deletion.
        </span>
      )}
    </LayoutGroup>
  );
}
