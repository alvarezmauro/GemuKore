"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  House,
  Layers,
  TextCursorInput,
  Inbox,
  MapPin,
  Wrench,
  Camera,
  Search,
  Globe,
  LibraryBig,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionAllowed } from "@/lib/motion/use-motion-preference";
import { dockTransition, dockHighlightTransition } from "@/lib/motion/tokens";

const DockLink = motion.create(Link);

const icons = {
  overview: House,
  cards: Layers,
  forms: TextCursorInput,
  feedback: Inbox,
  locations: MapPin,
  defects: Wrench,
  photos: Camera,
  search: Search,
  public: Globe,
  catalog: LibraryBig,
};

export type NavigationItem = {
  label: string;
  href: string;
  icon: keyof typeof icons;
  current?: boolean;
};

export function Navigation({
  items,
  onNavigate,
  compact = false,
  expanded = false,
  id,
}: {
  items: readonly NavigationItem[];
  onNavigate?: () => void;
  compact?: boolean;
  expanded?: boolean;
  id?: string;
}) {
  const motionAllowed = useMotionAllowed();
  return (
    <nav
      id={id}
      aria-label="Main navigation"
      className={compact ? "rail-navigation" : "space-y-1"}
    >
      {items.map(({ label, href, icon, current }) => {
        const Icon = icons[icon];
        const ItemLink = compact ? DockLink : Link;
        return (
          <ItemLink
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={current ? "page" : undefined}
            aria-label={compact ? label : undefined}
            className={cn(
              compact
                ? "rail-link"
                : "flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-[15px] leading-5 hover:bg-sidebar-accent motion-reduce:transition-none",
              current && "bg-sidebar-accent font-semibold",
            )}
            {...(compact
              ? {
                  initial: false,
                  animate: "rest",
                  whileHover: "highlight",
                  whileFocus: "highlight",
                }
              : {})}
          >
            {compact && (
              <motion.span
                aria-hidden="true"
                className="rail-link-highlight"
                variants={{
                  rest: { opacity: 0, scale: motionAllowed ? 0.6 : 1 },
                  highlight: { opacity: 1, scale: 1 },
                }}
                transition={
                  motionAllowed ? dockHighlightTransition : { duration: 0 }
                }
              />
            )}
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            {compact && (
              <motion.span
                className="rail-link-title"
                aria-hidden="true"
                initial={false}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={motionAllowed ? dockTransition : { duration: 0 }}
              >
                {label}
              </motion.span>
            )}
            <span
              className={compact ? "rail-link-label" : "min-w-0 break-words"}
              aria-hidden={compact || undefined}
            >
              {label}
            </span>
            {current && !compact && (
              <span
                className="ml-auto size-1.5 shrink-0 rounded-full bg-foreground"
                aria-hidden="true"
              />
            )}
          </ItemLink>
        );
      })}
    </nav>
  );
}
