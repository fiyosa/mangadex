import { getChapterLatest } from '@/api/server/getChapterLatest'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const order = searchParams.get('order')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    const result = await getChapterLatest({
      query: {
        ...(order && { order }),
        ...(limit && { limit }),
        ...(page && { page }),
      },
    })

    return NextResponse.json(result.data, { status: result.status })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message }, { status: 500 })
  }
}
