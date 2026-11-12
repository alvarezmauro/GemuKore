import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Gamepad2,
  Disc3,
  Cable,
  Package,
  Wrench,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { BentoGrid } from "@/components/magic/bento-grid";
import { NumberTicker } from "@/components/magic/number-ticker";
import { Button } from "@/components/ui/button";
import { RecentImage } from "./recent-image";
import { RecentCarousel } from "./recent-carousel";
import { HardwareArt } from "./hardware-art";
import { RefreshOverview } from "./refresh-overview";
import type { DashboardData } from "../contracts";

const categories = [
  {
    key: "consoles",
    label: "Consoles",
    type: "console",
    Icon: Gamepad2,
    description: "Every generation of play",
  },
  {
    key: "games",
    label: "Games",
    type: "game",
    Icon: Disc3,
    description: "Your next great adventure",
  },
  {
    key: "accessories",
    label: "Accessories",
    type: "accessory",
    Icon: Cable,
    description: "The little things that complete it",
  },
] as const;
const categoryLabels = {
  CONSOLE: "Console",
  GAME: "Game",
  ACCESSORY: "Accessory",
};

export function Dashboard({ data: d }: { data: DashboardData }) {
  const latest = d.recent[0];
  return (
    <div className="dashboard">
      <BentoGrid aria-label="Collection overview" className="dashboard-grid">
        <section
          className="collection-hero dashboard-enter"
          aria-labelledby="collection-title"
        >
          <div className="collection-hero-art-crop" aria-hidden="true">
            <div className="collection-hero-art-mask">
              <Image
                src="/images/dashboard/reference-art.png"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 100vw, 150vw"
                className="collection-hero-art"
              />
            </div>
          </div>
          <div className="collection-hero-content">
            <nav className="hero-tabs" aria-label="Collection categories">
              <Link href="/app/collection" className="hero-tab-active">
                <Layers aria-hidden="true" />
                <span>My Collection</span>
              </Link>
              {categories.map(({ type, label, Icon }) => (
                <Link
                  key={type}
                  href={`/app/collection?type=${type}`}
                  aria-label={`Explore ${label.toLowerCase()}`}
                  title={label}
                >
                  <Icon aria-hidden="true" />
                </Link>
              ))}
            </nav>
            <h1 id="collection-title" aria-label="Your collection">
              Your Gaming
              <br />
              Collection
            </h1>
            <p>
              Your games. Your hardware.
              <br />
              Every era of your story, together.
            </p>
            <Link className="hero-item-count" href="/app/collection">
              <Gamepad2 aria-hidden="true" />
              <strong>{d.counts.total.toLocaleString("en-US")} items</strong>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <nav
          aria-label="Explore your collection"
          className="dashboard-shortcuts dashboard-enter"
        >
          {categories.map(({ key, type, label, description }) => (
            <Link
              key={type}
              href={`/app/collection?type=${type}`}
              className={`hardware-shortcut shortcut-${key}`}
            >
              <HardwareArt kind={type} />
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
              <ChevronRight aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <section
          className="dashboard-stats dashboard-enter"
          aria-labelledby="dashboard-stats-title"
        >
          <div className="dashboard-section-heading">
            <h2 id="dashboard-stats-title">Your Stats</h2>
            <Link
              href="/app/collection"
              aria-label="View collection statistics"
            >
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="stats-panel">
            <section className="stats-total" aria-labelledby="dashboard-total">
              <div className="stats-orbit" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="stats-total-content">
                <h3 id="dashboard-total">Total items</h3>
                <p>
                  <NumberTicker value={d.counts.total} />
                </p>
              </div>
            </section>
            <div className="stats-categories">
              {categories.map(({ key, label, type, Icon }) => (
                <section key={key} aria-labelledby={`dashboard-${key}`}>
                  <Link
                    href={`/app/collection?type=${type}`}
                    aria-label={`Browse ${label.toLowerCase()}`}
                    className={`stat-category-icon stat-${key}`}
                  >
                    <Icon aria-hidden="true" />
                  </Link>
                  <p>
                    <NumberTicker value={d.counts[key]} />
                  </p>
                  <h3 id={`dashboard-${key}`}>{label}</h3>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="dashboard-recent"
          className="dashboard-additions dashboard-enter"
        >
          <div className="dashboard-section-heading">
            <h2 id="dashboard-recent">New Additions</h2>
            <Link
              href="/app/collection?sort=newest"
              aria-label="See more recent additions"
            >
              See more <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          {d.recent.length ? (
            <RecentCarousel
              items={d.recent.map((item) => ({
                id: item.id,
                content: (
                  <Link
                    href={item.href}
                    className={`recent-game-card recent-${item.type.toLowerCase()}`}
                  >
                    <RecentImage
                      photo={item.photo}
                      type={item.type}
                      variant="card"
                    />
                    <span className="recent-type">
                      <span className="recent-type-dot" />
                      {categoryLabels[item.type]}
                    </span>
                    <div className="recent-game-info">
                      <h3>{item.title}</h3>
                      <p>{item.context}</p>
                      <small>
                        Added{" "}
                        <time dateTime={item.addedAt}>{item.addedLabel}</time> ·
                        UTC
                      </small>
                    </div>
                    <span className="recent-card-arrow" aria-hidden="true">
                      <ArrowUpRight />
                    </span>
                  </Link>
                ),
              }))}
            />
          ) : (
            <div className="dashboard-empty">
              <Sparkles aria-hidden="true" />
              <div>
                <h3>Your collection starts here</h3>
                <p>
                  {d.canManage
                    ? "Add your first physical copy. Your next favorite memory is waiting."
                    : "No physical copies have been added yet. An editor can add the first item."}
                </p>
                {d.canManage && (
                  <Button asChild>
                    <Link href="/app/games/new">
                      <Plus aria-hidden="true" />
                      Add your first game
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>

        <section
          className="dashboard-latest dashboard-enter"
          aria-labelledby="dashboard-latest-title"
        >
          <div className="dashboard-section-heading">
            <h2 id="dashboard-latest-title">Last Added</h2>
            <Link href="/app/collection?sort=newest">
              See more <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          {latest ? (
            <Link className="last-added-card" href={latest.href}>
              <RecentImage
                photo={latest.photo}
                type={latest.type}
                showStatus={false}
              />
              <div className="last-added-info">
                <h3>{latest.title}</h3>
                <p>
                  <span>{categoryLabels[latest.type]}</span>
                  <span>{latest.context}</span>
                </p>
              </div>
              <div className="last-added-date">
                <span>
                  Added{" "}
                  <time dateTime={latest.addedAt}>{latest.addedLabel}</time>
                </span>
                <small>UTC</small>
              </div>
              <ArrowUpRight className="last-added-arrow" aria-hidden="true" />
            </Link>
          ) : (
            <div className="last-added-card last-added-empty">
              <Package aria-hidden="true" />
              <p>A space for your next great find.</p>
            </div>
          )}
        </section>
      </BentoGrid>
      <footer className="dashboard-footer">
        <p>
          <span className="collection-live-dot" />
          Private collection
          <span className="dashboard-role">
            {d.role === "ADMIN"
              ? "Administrator"
              : d.role === "EDITOR"
                ? "Editor"
                : "Viewer"}
          </span>
        </p>
        <div className="stats-condition">
          <section aria-labelledby="dashboard-boxed">
            <Link href="/app/collection?hasBox=true">
              <Package aria-hidden="true" />
              <span>
                <h3 id="dashboard-boxed">Boxed items</h3>
                <small>Box confirmed</small>
              </span>
              <NumberTicker value={d.counts.boxed} />
            </Link>
          </section>
          <section aria-labelledby="dashboard-defects">
            <Link href="/app/defects">
              <Wrench aria-hidden="true" />
              <span>
                <h3
                  id="dashboard-defects"
                  aria-label="Items with active defects"
                >
                  Active defects
                </h3>
                <small>Copies needing care</small>
              </span>
              <NumberTicker value={d.counts.activeDefects} />
            </Link>
          </section>
        </div>
        <RefreshOverview compact />
      </footer>
    </div>
  );
}
