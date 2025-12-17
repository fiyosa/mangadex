'use client'

import { getMangaById } from '@/api/mangadex/manga'
import { getFeedByMangaId } from '@/api/mangadex/feed/getFeedByMangaId'
import { mangadexService } from '@/services'
import { Card, CardBody, Image, Tab, Tabs, Chip, Skeleton, Button, Pagination } from '@heroui/react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Flag } from '@/components/ui'
import Link from 'next/link'
import { getStatisticByMangaId } from '@/api/mangadex/statistics'
import { ArrowLeft, BookOpen, User, Star, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react'

export default function MangaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState<string>('en')
  const [isExpanded, setIsExpanded] = useState(false)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  const mangaId = params.manga_id as string

  const { data: mangaData, isLoading: isMangaLoading } = getMangaById({
    props: {
      param: { manga_id: mangaId },
      query: { 'includes[]': ['cover_art', 'author', 'artist'] },
    },
  })

  const { data: statisticsData } = getStatisticByMangaId({
    props: {
      param: { manga_id: mangaId },
    },
  })

  const fetchFeedByMangaId = getFeedByMangaId({
    props: {
      param: { manga_id: mangaId },
      query: {
        limit: 100,
        offset: (page - 1) * 100,
        'translatedLanguage[]': [selectedLang],
        'order[chapter]': order,
        'includes[]': ['scanlation_group', 'user'],
      },
    },
  })

  const manga = mangaData?.data?.data
  const attributes = manga?.attributes
  const relationships = manga?.relationships || []
  const rating = statisticsData?.data?.statistics?.[mangaId]?.rating?.average

  const coverArt = relationships.find((rel: any) => rel.type === 'cover_art')?.attributes?.fileName
  const author = relationships.find((rel: any) => rel.type === 'author')?.attributes?.name
  const artist = relationships.find((rel: any) => rel.type === 'artist')?.attributes?.name

  const title = attributes?.title?.en || Object.values(attributes?.title || {})[0]
  const description = attributes?.description?.en || Object.values(attributes?.description || {})[0]

  const chapters = fetchFeedByMangaId.data?.data?.data || []
  const totalChapters = fetchFeedByMangaId.data?.data?.total || 0
  const totalPages = Math.ceil(totalChapters / 100)

  if (isMangaLoading) {
    return (
      <div className="container mx-auto min-h-screen p-4">
        <Skeleton className="mb-8 h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-10">
      {/* Backdrop Header */}
      <div className="relative h-64 w-full overflow-hidden">
        {coverArt && (
          <>
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-xl"
              style={{ backgroundImage: `url(${mangadexService.getImageCover(mangaId, coverArt)})` }}
            />
            <div className="to-background absolute inset-0 bg-linear-to-b from-transparent" />
          </>
        )}
      </div>

      <div className="relative z-10 container mx-auto -mt-32 px-4">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Left Column: Cover & Info */}
          <div className="flex w-full shrink-0 flex-col items-center gap-4 md:w-64 md:items-start">
            <Card className="h-72 w-48 border-none shadow-2xl md:h-96 md:w-64">
              <Image
                src={coverArt ? mangadexService.getImageCover(mangaId, coverArt) : '/placeholder.jpg'}
                alt={title}
                className="z-0 h-full w-full object-cover"
                removeWrapper
              />
            </Card>

            <div className="flex w-full flex-wrap justify-center gap-2 md:justify-start">
              {rating && (
                <Chip
                  startContent={<Star size={14} className="fill-yellow-500 text-yellow-500" />}
                  variant="flat"
                  size="sm"
                  className="pl-1"
                >
                  {rating.toFixed(1)}
                </Chip>
              )}
              <Chip color={attributes?.status === 'completed' ? 'success' : 'primary'} variant="flat" size="sm">
                {attributes?.status?.toUpperCase()}
              </Chip>
              {attributes?.publicationDemographic && (
                <Chip variant="flat" size="sm">
                  {attributes.publicationDemographic.toUpperCase()}
                </Chip>
              )}
              {attributes?.tags?.slice(0, 3).map((tag: any) => (
                <Chip key={tag.id} variant="flat" size="sm">
                  {tag.attributes?.name?.en}
                </Chip>
              ))}
              {attributes?.contentRating && (
                <Chip color="danger" variant="flat" size="sm">
                  {attributes?.contentRating?.toUpperCase()}
                </Chip>
              )}
            </div>
          </div>

          {/* Right Column: Details & Chapters */}
          <div className="flex-1 space-y-6 pt-4 md:pt-0">
            <div>
              <h1 className="text-foreground mb-2 text-3xl font-bold md:text-5xl">{title}</h1>
              <div className="text-foreground-500 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {attributes?.year && (
                  <Chip size="sm" variant="flat">
                    {attributes.year}
                  </Chip>
                )}
                {author && (
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{author}</span>
                  </div>
                )}
                {artist && artist !== author && (
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{artist}</span>
                  </div>
                )}
              </div>
            </div>

            <Card className="bg-content1/50 backdrop-blur-md">
              <CardBody className="p-4">
                <p className="text-foreground-600 text-sm leading-relaxed md:text-base">
                  {isExpanded
                    ? description
                    : description?.length > 300
                      ? description.slice(0, 300) + '...'
                      : description}
                  {description?.length > 300 && (
                    <span
                      className="text-primary ml-1 cursor-pointer font-medium hover:underline"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? 'Show Less' : 'Read More'}
                    </span>
                  )}
                </p>
              </CardBody>
            </Card>

            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <BookOpen size={20} />
                  Chapters
                </h2>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    size="sm"
                    variant="flat"
                    className="min-w-0"
                    onPress={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
                    startContent={
                      order === 'desc' ? <ArrowDownWideNarrow size={16} /> : <ArrowUpWideNarrow size={16} />
                    }
                  >
                    {order === 'desc' ? 'Newest' : 'Oldest'}
                  </Button>
                  <Tabs
                    aria-label="Languages"
                    selectedKey={selectedLang}
                    onSelectionChange={(key) => {
                      setSelectedLang(key as string)
                      setPage(1)
                    }}
                    size="sm"
                    variant="underlined"
                  >
                    <Tab
                      key="en"
                      title={
                        <div className="flex items-center gap-2">
                          <Flag countryCode="GB" svg /> ENG
                        </div>
                      }
                    />
                    <Tab
                      key="id"
                      title={
                        <div className="flex items-center gap-2">
                          <Flag countryCode="ID" svg /> IND
                        </div>
                      }
                    />
                    {/* Add more as needed */}
                  </Tabs>
                </div>
              </div>

              {fetchFeedByMangaId.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : chapters.length === 0 ? (
                <div className="text-foreground-500 py-10 text-center">No chapters found for this language.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {chapters.map((chapter: any) => (
                      <Link
                        key={chapter.id}
                        href={`/comic/${mangaId}/${selectedLang}/${chapter.id}`}
                        className="group block"
                      >
                        <Card className="bg-content2 hover:bg-content3 border-l-primary w-full border-l-4 transition-colors">
                          <CardBody className="px-4 py-3">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="group-hover:text-primary text-lg font-bold transition-colors">
                                Ch. {chapter.attributes.chapter}
                              </span>
                              <span className="text-tiny text-foreground-400 flex items-center gap-1">
                                <User size={12} />
                                {chapter.relationships?.[2]?.attributes?.username || '-'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-foreground-500 max-w-[150px] truncate text-xs">
                                {chapter.attributes.title || 'No Title'}
                              </span>
                              <span className="text-tiny text-foreground-400">
                                Vol. {chapter.attributes.volume || '-'}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                      <Pagination
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        showControls
                        color="primary"
                        variant="flat"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
