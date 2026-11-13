import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LocationEntry } from "../contracts";

type BranchProps = {
  location: LocationEntry;
  byParent: ReadonlyMap<string | null, LocationEntry[]>;
  renderRow: (location: LocationEntry) => ReactNode;
};

function LocationBranch({ location, byParent, renderRow }: BranchProps) {
  const children = byParent.get(location.id) ?? [];
  // Bound visual indentation, while retaining the full semantic hierarchy and
  // breadcrumbs so very deep locations remain usable on narrow screens.
  const indented = location.path.length <= 3;
  return (
    <>
      {renderRow(location)}
      {children.length > 0 && (
        <ul
          aria-label={`Children of ${location.name}`}
          className={
            indented
              ? location.path.length === 1
                ? "location-children mt-2 ml-3 space-y-2 pl-[18px] sm:ml-5 sm:pl-[22px]"
                : "location-children mt-2 space-y-2 sm:ml-5 sm:pl-[22px]"
              : "mt-2 space-y-2"
          }
        >
          {children.map((child, index) => (
            <li key={child.id} className="relative min-w-0">
              {indented && (
                <span
                  aria-hidden="true"
                  className={`${location.path.length > 1 ? "hidden sm:block" : ""} pointer-events-none absolute inset-y-0 -left-[18px] w-4 sm:-left-[22px] sm:w-5`}
                >
                  <span
                    className={`absolute top-0 left-0 border-l-2 border-input/70 ${index === children.length - 1 ? "h-7" : "-bottom-2"}`}
                  />
                  <span className="absolute inset-x-0 top-7 border-t-2 border-input/70" />
                </span>
              )}
              <LocationBranch
                location={child}
                byParent={byParent}
                renderRow={renderRow}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function LocationTree({
  locations,
  children: renderRow,
}: {
  locations: LocationEntry[];
  children: (location: LocationEntry) => ReactNode;
}) {
  const byParent = new Map<string | null, LocationEntry[]>();
  for (const location of locations) {
    const siblings = byParent.get(location.parentId) ?? [];
    siblings.push(location);
    byParent.set(location.parentId, siblings);
  }
  return (
    <ul aria-label="Location hierarchy" className="space-y-4">
      {(byParent.get(null) ?? []).map((location) => (
        <li key={location.id}>
          <Card className="[--card-spacing:--spacing(3)] sm:[--card-spacing:--spacing(4)]">
            <CardContent className="space-y-2">
              <LocationBranch
                location={location}
                byParent={byParent}
                renderRow={renderRow}
              />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
