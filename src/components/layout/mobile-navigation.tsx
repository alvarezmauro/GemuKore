"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HamburgerIcon } from "@/components/ui/hamburger-icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Navigation, type NavigationItem } from "./navigation";

// Matches the shell's Tailwind lg breakpoint (64rem).
const desktopQuery = "(min-width: 64rem)";

export function MobileNavigation({
  items,
  context,
}: {
  items: readonly NavigationItem[];
  context: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia(desktopQuery);
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          className="hamburger-button lg:hidden"
        >
          <HamburgerIcon open={open} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[min(320px,calc(100%-24px))]!"
        onCloseAutoFocus={(event) => {
          if (window.matchMedia(desktopQuery).matches) {
            // The mobile trigger is hidden; keep focus on a visible landmark.
            event.preventDefault();
            document.getElementById("main-content")?.focus();
          }
        }}
      >
        <SheetHeader className="p-6 pr-16">
          <SheetTitle>GemuKore</SheetTitle>
          <SheetDescription>{context}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          <Navigation items={items} onNavigate={() => setOpen(false)} />
        </div>
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hamburger-button absolute top-3 right-3"
            aria-label="Close"
          >
            <HamburgerIcon open={open} />
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
