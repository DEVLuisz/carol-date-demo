import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { DateSpot } from "./spots";

const LeafletMap = lazy(() => import("./LeafletMap"));

interface SpMapProps {
  selected: DateSpot | null;
  onSelect: (spot: DateSpot) => void;
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="shimmer-text font-display text-sm uppercase tracking-[0.35em]">
        Carregando São Paulo...
      </span>
    </div>
  );
}

export function SpMap({ selected, onSelect }: SpMapProps) {
  return (
    <div className="surface-card sp-map-shell relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
      <ClientOnly fallback={<MapSkeleton />}>
        <Suspense fallback={<MapSkeleton />}>
          <LeafletMap selected={selected} onSelect={onSelect} />
        </Suspense>
      </ClientOnly>
      <div className="pointer-events-none absolute bottom-3 left-4 z-500 font-display text-xs uppercase tracking-[0.35em] text-muted-foreground drop-shadow">
        São Paulo · SP
      </div>
    </div>
  );
}
