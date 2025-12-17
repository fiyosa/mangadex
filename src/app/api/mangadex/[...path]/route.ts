import * as MangaDexApi from '@/api/mangadex'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path
    const functionName = path[path.length - 1]

    // Find the function in the exported module
    const apiFunction = (MangaDexApi as any)[functionName]

    if (typeof apiFunction !== 'function') {
      return NextResponse.json({ message: `Function '${functionName}' not found in MangaDex API` }, { status: 404 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const query: Record<string, any> = {}

    url.searchParams.forEach((value, key) => {
      // Handle array convention (e.g., includes[])
      if (key.endsWith('[]')) {
        if (!query[key]) {
          query[key] = []
        }
        if (Array.isArray(query[key])) {
          query[key].push(value)
        }
      } else {
        // Handle explicit "param" vs "query" if needed, but here we merge.
        // If a key appears multiple times without [], convert to array or keep last?
        // Standard URLSearchParams behavior overrides unless we handle it.
        // We'll stick to simple assignment for non-array keys.
        query[key] = value
      }
    })

    // Call the original fetcher function.
    // We pass 'query' to both 'param' and 'query' props because the fetcher
    // determines where to look based on its definition.
    const result = await apiFunction({
      param: query,
      query: query,
    })

    return NextResponse.json(result.data)
  } catch (err: any) {
    console.error('API Proxy Error:', err)
    return NextResponse.json(
      { message: err?.message || 'Internal Server Error', error: err },
      { status: err?.status || 500 }
    )
  }
}
