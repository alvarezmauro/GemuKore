import type { ReactNode } from "react";
import { ThemeMenu } from "@/components/theme-menu";
import type { NavigationItem } from "./navigation";
import { MobileNavigation } from "./mobile-navigation";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { WorkspaceRail } from "./workspace-rail";

export function ApplicationShell({
  children,
  items,
  context,
  headerActions,
  dashboard = false,
  railAction,
}: {
  children: ReactNode;
  items: readonly NavigationItem[];
  context: string;
  headerActions?: ReactNode;
  dashboard?: boolean;
  railAction?: ReactNode;
}) {
  return (
    <div className="application-shell" data-dashboard={dashboard || undefined}>
      <a
        href="#main-content"
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-background px-4 py-3 focus:not-sr-only"
      >
        Skip to content
      </a>
      <WorkspaceRail items={items} action={railAction} />
      <div className="workspace-body">
        <header className="workspace-header">
          <div className="workspace-identity">
            <MobileNavigation items={items} context={context} />
            <Link
              href="/app"
              className="workspace-brand"
              aria-label="GemuKore home"
            >
              <Gamepad2 aria-hidden="true" />
              <span>GemuKore</span>
            </Link>
            <p className="workspace-greeting">
              {dashboard ? (
                <>
                  Welcome back, <strong>collector.</strong>
                </>
              ) : (
                context
              )}
            </p>
          </div>
          <div className="workspace-header-actions">
            {headerActions}
            <ThemeMenu compact />
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="workspace-main outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
