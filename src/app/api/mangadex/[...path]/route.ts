import * as MangaDexApi from '@/api/mangadex'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  console.log({ anjay: 'loh kok?' })

  try {
    const { path } = await params

    // Find the function in the exported module by checking path segments
    let functionName = ''
    let apiFunction = null

    for (const segment of path) {
      if (typeof (MangaDexApi as any)[segment] === 'function') {
        functionName = segment
        apiFunction = (MangaDexApi as any)[segment]
        break
      }
    }

    if (!apiFunction) {
      return NextResponse.json(
        { message: `Function not found in MangaDex API. Path: ${path.join('/')}` },
        { status: 404 }
      )
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
