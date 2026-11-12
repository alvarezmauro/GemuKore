"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedList } from "@/components/motion/animated-list";

export function RecentCarousel({
  items,
}: {
  items: readonly { id: string; content: ReactNode }[];
}) {
  const container = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ start: true, end: true });
  useEffect(() => {
    const track = container.current?.querySelector("ul");
    if (!track) return;
    const update = () => {
      const next = {
        start: track.scrollLeft < 2,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
      };
      setBounds((current) =>
        current.start === next.start && current.end === next.end
          ? current
          : next,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [items.length]);
  function move(direction: number) {
    const track = container.current?.querySelector("ul");
    if (track) track.scrollBy({ left: direction * track.clientWidth });
  }
  return (
    <div className="recent-carousel" ref={container}>
      <AnimatedList
        label="Recently added copies"
        className="recent-track"
        items={items}
      />
      <div
        className="recent-carousel-controls"
        aria-label="Recent additions controls"
      >
        <Button
          variant="secondary"
          size="icon"
          aria-label="Previous additions"
          disabled={bounds.start}
          onClick={() => move(-1)}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Next additions"
          disabled={bounds.end}
          onClick={() => move(1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
