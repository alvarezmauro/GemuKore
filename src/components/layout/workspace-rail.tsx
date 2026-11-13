"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HamburgerIcon } from "@/components/ui/hamburger-icon";
import { useMotionAllowed } from "@/lib/motion/use-motion-preference";
import { dockTransition } from "@/lib/motion/tokens";
import { Navigation, type NavigationItem } from "./navigation";

const desktopQuery = "(min-width: 64rem)";

export function WorkspaceRail({
  items,
  action,
}: {
  items: readonly NavigationItem[];
  action?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const motionAllowed = useMotionAllowed();
  const navigationId = useId();
  const rail = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusedWithin = useRef(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const desktop = window.matchMedia(desktopQuery);
    const closeOnMobile = () => {
      if (desktop.matches) return;
      setExpanded(false);
      // Hiding a focused control can clear activeElement before this callback.
      if (
        focusedWithin.current ||
        rail.current?.contains(document.activeElement)
      ) {
        focusedWithin.current = false;
        document.getElementById("main-content")?.focus();
      }
    };
    desktop.addEventListener("change", closeOnMobile);
    return () => desktop.removeEventListener("change", closeOnMobile);
  }, []);

  const ToggleIcon = expanded ? PanelLeftClose : PanelLeftOpen;
  return (
    <motion.div
      className="workspace-rail-slot"
      initial={false}
      animate={{ width: expanded ? "15rem" : "4.5rem" }}
      transition={motionAllowed ? dockTransition : { duration: 0 }}
    >
      <motion.aside
        ref={rail}
        aria-label="Workspace sidebar"
        className="workspace-rail"
        data-expanded={expanded}
        initial={false}
        animate={expanded ? "expanded" : "collapsed"}
        onFocusCapture={() => {
          focusedWithin.current = true;
        }}
        onBlurCapture={(event) => {
          if (window.matchMedia?.(desktopQuery).matches) {
            focusedWithin.current = event.currentTarget.contains(
              event.relatedTarget,
            );
          }
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || event.defaultPrevented || !expanded)
            return;
          event.preventDefault();
          setExpanded(false);
          trigger.current?.focus();
        }}
      >
        <div className="rail-heading">
          <Button
            ref={trigger}
            variant="ghost"
            size="icon"
            aria-label="Workspace menu"
            aria-expanded={expanded}
            aria-controls={navigationId}
            className="hamburger-button rail-menu-button"
            onClick={() => setExpanded((value) => !value)}
          >
            <HamburgerIcon open={expanded} />
          </Button>
          <motion.span
            className="rail-heading-label"
            aria-hidden="true"
            initial={false}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={motionAllowed ? dockTransition : { duration: 0 }}
          >
            GemuKore
          </motion.span>
        </div>
        <Navigation
          items={items}
          compact
          expanded={expanded}
          id={navigationId}
        />
        <div className="rail-footer">
          {action && <div className="rail-action">{action}</div>}
          <Button
            variant="ghost"
            size="icon"
            className="rail-toggle"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
            aria-controls={navigationId}
            onClick={() => setExpanded((value) => !value)}
          >
            <ToggleIcon aria-hidden="true" />
          </Button>
        </div>
      </motion.aside>
    </motion.div>
  );
}
