'use client' // Error boundaries must be Client Components

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    // global-error must include html and body tags
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-red-500/20 p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-16 w-16 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Something went wrong!</h2>
          <p className="mb-8 text-gray-400">
            A critical error occurred while rendering the application. We apologize for the inconvenience.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => reset()}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-hidden"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/comic')}
              className="rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-hidden"
            >
              Go Home
            </button>
          </div>
          {error.digest && <p className="mt-8 text-xs text-gray-600">Error Digest: {error.digest}</p>}
        </div>
      </body>
    </html>
  )
}
