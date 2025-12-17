'use client'

import { getAtHomeServer } from '@/api/mangadex/atHome'
import { getImageChapter } from '@/services/mangadexService'
import { Btn } from '@/components/ui/Btn'
import { Image, Select, SelectItem } from '@heroui/react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { getChapterById } from '@/api/mangadex/chapter'
import { getMangaAggregateById } from '@/api/mangadex/manga'
import { User } from 'lucide-react'

export default function ChapterReadPage() {
  const params = useParams()
  // Note: params.id might be ambiguous if nested routes use [id] twice.
  // Assuming the second [id] is effectively this page's route param.

  const router = useRouter()

  const fetchAtHomeServer = getAtHomeServer({
    props: {
      param: {
        chapter_id: `${params.chapter_id}`,
      },
      query: { forcePort443: false },
    },
  })

  const fetchChapterById = getChapterById({
    props: {
      param: {
        chapter_id: `${params.chapter_id}`,
      },
      query: { 'includes[]': ['manga', 'user'] },
    },
  })

  const fetchMangaAggregateById = getMangaAggregateById({
    props: {
      param: {
        manga_id: `${params.manga_id}`,
      },
      query: {
        'translatedLanguage[]': [params.lang as string],
        'groups[]': fetchChapterById.data?.data?.data?.relationships[0]?.id,
      },
    },
    enabled: fetchChapterById.isSuccess,
  })

  // Mock Images (Vertical Strip)
  // Using placeholders. In a real app, these would be URLs from Mangadex API
  const atHomeData = fetchAtHomeServer.data?.data

  const pages =
    atHomeData?.chapter?.data?.map((filename) => ({
      id: filename,
      url: getImageChapter(atHomeData.chapter.hash, filename),
    })) || []

  const chapters: any[] = useMemo(() => {
    const volumes = fetchMangaAggregateById.data?.data?.volumes
    if (!volumes) return []

    let allChapters: any[] = []
    Object.values(volumes).forEach((volume: any) => {
      Object.values(volume.chapters).forEach((chapter: any) => {
        allChapters.push(chapter)
      })
    })

    return allChapters.sort((a, b) => parseFloat(b.chapter) - parseFloat(a.chapter))
  }, [fetchMangaAggregateById.data])

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      router.push(`/comic/${params.manga_id}/${params.lang}/${e.target.value}`)
    }
  }

  const NavigationControls = () => {
    const currentChapterIndex = chapters.findIndex((c) => c.id === params.chapter_id)
    // chapters is sorted descending (e.g. 10, 9, ... 1)
    // Previous (lower chapter number) is at index + 1
    const prevChapter = chapters[currentChapterIndex + 1]
    // Next (higher chapter number) is at index - 1
    const nextChapter = chapters[currentChapterIndex - 1]

    return (
      <div className="border-divider bg-content1 text-foreground w-full border-y py-2">
        <div className="container mx-auto flex flex-col gap-2 px-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={'..'}>
                <Btn variant="flat" color="primary" size="sm">
                  ← Back
                </Btn>
              </Link>
              <div className="hidden flex-col justify-center sm:flex">
                <span className="text-foreground-600 line-clamp-1 text-sm leading-tight font-bold">
                  {
                    Object.values(
                      (fetchChapterById.data?.data?.data?.relationships[1]?.attributes?.title as object) ?? {}
                    )[0]
                  }
                </span>
                <span className="text-foreground-400 flex items-center gap-1 text-xs leading-tight">
                  <User size={12} />
                  {
                    fetchChapterById.data?.data?.data?.relationships?.find((rel: any) => rel.type === 'user')
                      ?.attributes?.username
                  }{' '}
                  | Chapter {fetchChapterById.data?.data?.data?.attributes?.chapter}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
              <Btn
                variant="solid"
                color="secondary"
                size="sm"
                disabled={!prevChapter}
                onPress={() => prevChapter && router.push(`/comic/${params.manga_id}/${params.lang}/${prevChapter.id}`)}
                isDisabled={!prevChapter}
              >
                Previous
              </Btn>

              <div className="w-30">
                <Select
                  aria-label="Select Ch."
                  placeholder="Select Ch."
                  selectedKeys={[params.chapter_id as string]}
                  onChange={handleChapterChange}
                  size="sm"
                  classNames={{
                    trigger: 'min-h-unit-8 h-8',
                    value: 'text-small',
                  }}
                >
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} textValue={`Ch. ${chapter.chapter}`}>
                      {chapter.chapter}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <Btn
                variant="solid"
                color="secondary"
                size="sm"
                disabled={!nextChapter}
                onPress={() => nextChapter && router.push(`/comic/${params.manga_id}/${params.lang}/${nextChapter.id}`)}
                isDisabled={!nextChapter}
              >
                Next
              </Btn>
            </div>
          </div>

          {/* Mobile Only Info */}
          <div className="flex flex-col items-center justify-center sm:hidden">
            <span className="text-foreground-600 line-clamp-1 text-center text-sm leading-tight font-bold">
              {
                Object.values(
                  (fetchChapterById.data?.data?.data?.relationships[1]?.attributes?.title as object) ?? {}
                )[0]
              }
            </span>
            <span className="text-foreground-400 flex items-center gap-1 text-xs leading-tight">
              <User size={12} />
              {
                fetchChapterById.data?.data?.data?.relationships?.find((rel: any) => rel.type === 'user')?.attributes
                  ?.username
              }{' '}
              | Chapter {fetchChapterById.data?.data?.data?.attributes?.chapter}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (fetchAtHomeServer.isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading chapter...</div>
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Top Nav */}
      <div>
        <NavigationControls />
      </div>

      {/* Main Content - Image List */}
      <div className="flex flex-1 flex-col items-center py-4">
        <div className="w-full max-w-3xl">
          {pages.map((page) => (
            <div key={page.id} className="relative w-full">
              {/* Image constraints */}
              <div className="relative h-auto w-full">
                <Image
                  src={page.url}
                  alt={`Page ${page.id}`}
                  className="mb-0! h-auto w-full rounded-none! object-contain"
                  radius="none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="pb-10">
        <NavigationControls />
      </div>
    </div>
  )
}
