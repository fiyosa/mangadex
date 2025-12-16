export const Loading = () => {
  return (
    <div className="bg-background fixed inset-0 z-9999 flex flex-col items-center justify-center">
      {/* Logo/Brand */}
      <div className="text-primary mb-8 text-4xl font-bold">
        <span className="animate-pulse">Skuy</span>
      </div>

      {/* Spinner */}
      <div className="relative h-16 w-16">
        {/* Outer ring */}
        <div className="border-t-primary absolute inset-0 animate-spin rounded-full border-4 border-transparent" />
        {/* Inner ring */}
        <div
          className="border-t-secondary absolute inset-2 animate-spin rounded-full border-4 border-transparent"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary h-3 w-3 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-foreground/60 mt-6 flex items-center gap-1 text-sm">
        <span>Memuat</span>
        <span className="inline-flex">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
            .
          </span>
        </span>
      </div>
    </div>
  )
}
