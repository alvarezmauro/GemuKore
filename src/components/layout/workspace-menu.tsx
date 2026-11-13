"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useMotionAllowed } from "@/lib/motion/use-motion-preference";
import { dockTransition } from "@/lib/motion/tokens";
import { Plus, Gamepad2, Disc3, Cable } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function AddItemMenu() {
  const motionAllowed = useMotionAllowed();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" aria-label="Add item" className="rail-add-button">
          <Plus aria-hidden="true" />
          <motion.span
            className="rail-add-label"
            aria-hidden="true"
            initial={false}
            variants={{ expanded: { opacity: 1 }, collapsed: { opacity: 0 } }}
            transition={motionAllowed ? dockTransition : { duration: 0 }}
          >
            Add item
          </motion.span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" sideOffset={16}>
        <DropdownMenuLabel>A new piece of your story</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/consoles/new">
            <Gamepad2 aria-hidden="true" />
            Add console
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/games/new">
            <Disc3 aria-hidden="true" />
            Add game
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/accessories/new">
            <Cable aria-hidden="true" />
            Add accessory
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
