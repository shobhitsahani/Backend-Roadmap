import { Skeleton } from "@/components/ui/skeleton";

/**
 * First-paint silhouettes shown while the roadmap snapshot streams in
 * (DESIGN.md §8: real layout shapes, pulsing opacity only).
 */
export function FirstPaintSkeleton() {
  return (
    <div className="min-h-dvh bg-canvas" aria-hidden="true" role="presentation">
      {/* Masthead */}
      <div className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 md:px-10">
          <Skeleton className="size-9 rounded-sm" />
          <Skeleton className="h-4 w-40" />
          <div className="ml-auto flex items-center gap-3">
            <Skeleton className="hidden h-4 w-32 lg:block" />
            <Skeleton className="size-10 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Overview: wordmark block + progress tile */}
      <div className="mx-auto max-w-[1440px] px-4 pt-10 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <Skeleton className="h-3 w-44" />
            <Skeleton className="mt-6 h-12 w-2/3" />
            <Skeleton className="mt-5 h-4 w-1/2" />
            <div className="mt-8 flex gap-2">
              {[0, 1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-6 w-28 md:w-36" />
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-hairline bg-panel p-6">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Phase rows with topic rows and checklist lines */}
      <div className="mx-auto max-w-[1440px] px-4 pt-12 md:px-10">
        {[0, 1].map((phaseIndex) => (
          <section key={phaseIndex} className="border-t border-hairline py-8">
            <div className="flex items-end justify-between gap-6">
              <div className="flex min-w-0 items-baseline gap-6">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-7 w-48 md:w-64" />
              </div>
              <Skeleton className="hidden h-3 w-40 md:block" />
            </div>
            <div className="mt-6 flex flex-col">
              {[0, 1].map((topicIndex) => (
                <div
                  key={topicIndex}
                  className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline py-4 pr-1"
                >
                  <Skeleton className="size-6" />
                  <div>
                    <Skeleton className="h-4 w-44 max-w-full md:w-60" />
                    <Skeleton className="mt-2 h-3 w-32 max-w-full" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
