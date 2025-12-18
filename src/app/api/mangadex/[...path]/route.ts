import secretServer from '@/config/secretServer'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    const endpoint = path.join('/')
    const searchParams = request.nextUrl.searchParams.toString()

    const fullUrl = secretServer.API_URL_MANGADEX + `/${endpoint}${searchParams ? `?${searchParams}` : ''}`

    const res = await fetch(fullUrl)
    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
