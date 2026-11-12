import Link from "next/link";
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
}: {
  items: readonly NavigationItem[];
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <nav
      aria-label="Main navigation"
      className={compact ? "rail-navigation" : "space-y-1"}
    >
      {items.map(({ label, href, icon, current }) => {
        const Icon = icons[icon];
        return (
          <Link
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
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            <span
              className={compact ? "rail-link-label" : "min-w-0 break-words"}
            >
              {label}
            </span>
            {current && !compact && (
              <span
                className="ml-auto size-1.5 shrink-0 rounded-full bg-foreground"
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
