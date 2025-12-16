import { CardSkeleton } from './_lib/CardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-2">
      <div className="w-full">
        <div className="grid grid-cols-[repeat(auto-fill,160px)] justify-center gap-4">
          {Array.from({ length: 16 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
