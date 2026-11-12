"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
export function RefreshOverview({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <form
      action="/app"
      method="get"
      className="min-w-0 max-w-full space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => router.refresh());
      }}
    >
      <Button
        type="submit"
        variant={compact ? "ghost" : "outline"}
        className={compact ? "dashboard-refresh" : undefined}
        disabled={pending}
        aria-busy={pending}
      >
        {compact && <RefreshCw aria-hidden="true" />}
        {pending ? "Refreshing…" : "Refresh overview"}
      </Button>
      {pending && (
        <div role="status">
          <span className="sr-only">
            Refreshing collection overview. Current values remain visible.
          </span>
          <Skeleton className="h-1 w-full" aria-hidden="true" />
        </div>
      )}
    </form>
  );
}
