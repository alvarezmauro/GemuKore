import Link from "next/link";
import {
  Layers,
  Gamepad2,
  Disc3,
  Cable,
  Package,
  Wrench,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Crosshair,
} from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/magic/bento-grid";
import { NumberTicker } from "@/components/magic/number-ticker";
import { AnimatedList } from "@/components/motion/animated-list";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RecentImage } from "./recent-image";
import { RefreshOverview } from "./refresh-overview";
import type { DashboardData } from "../contracts";
const categoryLabels = {
  CONSOLE: "Console",
  GAME: "Game",
  ACCESSORY: "Accessory",
};
export function Dashboard({ data: d }: { data: DashboardData }) {
  const categories = [
    { key: "consoles", label: "Consoles", type: "console", Icon: Gamepad2 },
    { key: "games", label: "Games", type: "game", Icon: Disc3 },
    {
      key: "accessories",
      label: "Accessories",
      type: "accessory",
      Icon: Cable,
    },
  ] as const;
  return (
    <div className="min-w-0 space-y-8 [overflow-wrap:anywhere] [&_a]:max-w-full [&_a]:whitespace-normal [&_button]:h-auto [&_button]:min-h-11 [&_button]:max-w-full [&_button]:whitespace-normal">
      <PageHeader
        title="Your collection"
        description="Your games. Your hardware. Your own little piece of gaming history."
        action={
          <Button asChild>
            <Link href="/app/collection">
              Browse collection{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        }
      />
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-3">
        <Badge variant="secondary">
          {d.role === "ADMIN"
            ? "Administrator"
            : d.role === "EDITOR"
              ? "Editor"
              : "Viewer"}
        </Badge>
        <p className="text-sm text-muted-foreground">
          Private collection overview
        </p>
        <div className="ml-auto">
          <RefreshOverview />
        </div>
      </div>
      <BentoGrid aria-label="Collection overview">
        <BentoCard
          aria-labelledby="dashboard-total"
          className="dashboard-hero relative overflow-hidden sm:col-span-2 xl:col-span-3"
        >
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-lg space-y-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Crosshair className="size-4" aria-hidden="true" />
                Collection headquarters
              </div>
              <h2 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl">
                A home for every
                <br />
                era of play.
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                From the first cartridge to your latest find. Keep the physical
                pieces of your gaming story together.
              </p>
              <div className="flex flex-wrap gap-3">
                {d.canManage && (
                  <Button asChild>
                    <Link href="/app/games/new">
                      <Plus className="size-4" aria-hidden="true" />
                      Add game
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link href="/app/collection?sort=newest">
                    Explore collection
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="dashboard-controller" aria-hidden="true">
              <Gamepad2 strokeWidth={1} />
              <span className="dashboard-controller-orbit" />
            </div>
            <div className="w-full border-t border-border pt-5 sm:w-auto sm:min-w-40 sm:border-t-0 sm:border-l sm:pl-8">
              <h2
                id="dashboard-total"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Layers className="size-4" aria-hidden="true" />
                Total items
              </h2>
              <p className="my-3 font-heading text-6xl tracking-tight sm:text-7xl">
                <NumberTicker value={d.counts.total} />
              </p>
              <p className="max-w-48 text-sm text-muted-foreground">
                Each owned copy counts once, including copies of the same
                catalog item.
              </p>
            </div>
          </div>
        </BentoCard>
        {categories.map(({ key, label, type, Icon }) => (
          <BentoCard
            key={key}
            aria-labelledby={`dashboard-${key}`}
            className="dashboard-category relative overflow-hidden border border-border"
          >
            <Icon
              className="pointer-events-none absolute -right-4 top-8 size-28 text-muted"
              strokeWidth={1}
              aria-hidden="true"
            />
            <div className="relative space-y-3">
              <h2
                id={`dashboard-${key}`}
                className="flex items-center gap-2 font-medium"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-stone">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {label}
              </h2>
              <p className="relative font-heading text-4xl tracking-tight">
                <NumberTicker value={d.counts[key]} />
              </p>
              <Link
                className="relative inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                href={`/app/collection?type=${type}`}
              >
                Browse {label.toLowerCase()}
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </Link>
            </div>
          </BentoCard>
        ))}
        <BentoCard
          aria-labelledby="dashboard-boxed"
          className="border border-border"
        >
          <h2
            id="dashboard-boxed"
            className="flex items-center gap-2 font-medium"
          >
            <Package className="size-5" aria-hidden="true" />
            Boxed items
          </h2>
          <p className="relative font-heading text-4xl tracking-tight">
            <NumberTicker value={d.counts.boxed} />
          </p>
          <p className="text-sm text-muted-foreground">
            Copies confirmed to have a box. This does not establish
            completeness.
          </p>
          <Link
            className="inline-flex min-h-11 items-center text-sm text-link underline underline-offset-4"
            href="/app/collection?hasBox=true"
          >
            Browse boxed items
          </Link>
        </BentoCard>
        <BentoCard
          aria-labelledby="dashboard-defects"
          className="border border-border xl:col-span-2"
        >
          <h2
            id="dashboard-defects"
            className="flex items-center gap-2 font-medium"
          >
            <Wrench className="size-5" aria-hidden="true" />
            Items with active defects
          </h2>
          <p className="relative font-heading text-4xl tracking-tight">
            <NumberTicker value={d.counts.activeDefects} />
          </p>
          <p className="text-sm text-muted-foreground">
            Copies with at least one active defect, counted once per copy.
            Accepted and repaired defects are excluded.
          </p>
          <Link
            className="inline-flex min-h-11 items-center text-sm text-link underline underline-offset-4"
            href="/app/defects"
          >
            Review defect records
          </Link>
        </BentoCard>
      </BentoGrid>
      <section aria-labelledby="dashboard-recent" className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="dashboard-recent" className="font-heading text-2xl">
            Recently added
          </h2>
          <Button asChild variant="outline">
            <Link href="/app/collection?sort=newest">
              View all recent additions
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Your newest physical copies. Dates are shown in UTC.
          {d.moreRecent ? " Showing the latest eight copies." : ""}
        </p>
        {d.recent.length ? (
          <AnimatedList
            label="Recently added copies"
            items={d.recent.map((item) => ({
              id: item.id,
              content: (
                <Link
                  href={item.href}
                  className="flex min-w-0 items-start gap-4 rounded-xl bg-card p-4 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <RecentImage photo={item.photo} />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium text-heading">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.context}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>{categoryLabels[item.type]}</span>
                      <span>
                        Added{" "}
                        <time dateTime={item.addedAt}>{item.addedLabel}</time>
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              ),
            }))}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-input bg-card px-4 py-8">
            <EmptyState
              title="Your collection starts here"
              description={
                d.canManage
                  ? "Add your first physical copy to see your collection take shape."
                  : "No physical copies have been added yet. An editor can add the first item."
              }
              action={
                d.canManage ? (
                  <Button asChild>
                    <Link href="/app/games/new">Add your first game</Link>
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </section>
      <section
        aria-labelledby="dashboard-workspace"
        className="space-y-4 rounded-xl bg-card p-5 sm:p-6"
      >
        <h2 id="dashboard-workspace" className="font-heading text-2xl">
          Collection workspace
        </h2>
        <div className="flex flex-wrap gap-3">
          {d.canManage && (
            <>
              <Button asChild>
                <Link href="/app/consoles/new">Add console</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/games/new">Add game</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/accessories/new">Add accessory</Link>
              </Button>
            </>
          )}
          <Button asChild variant="outline">
            <Link href="/app/search">Search collection</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/locations">
              {d.canManage ? "Manage locations" : "View locations"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/defects">
              {d.canManage ? "Manage defects" : "View defects"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/media">
              {d.canManage ? "Manage photos" : "View photos"}
            </Link>
          </Button>
          {d.role === "ADMIN" && (
            <Button asChild variant="outline">
              <Link href="/app/catalog">Manage console catalog</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
