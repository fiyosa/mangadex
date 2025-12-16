'use client'

export const CardSkeleton = () => {
  return (
    <div className="group relative flex h-60 w-40 flex-col overflow-hidden rounded-3xl bg-slate-200 p-1 shadow-lg">
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-300">
        {/* Skeleton shimmer animation */}
        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-slate-300 via-slate-200 to-slate-300" />

        {/* Fake title skeleton */}
        <div className="absolute bottom-0 left-0 w-full p-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-400/50" />
          <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-slate-400/50" />
        </div>
      </div>
    </div>
  )
}
