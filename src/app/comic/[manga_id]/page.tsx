'use client'

import { getMangaById, getMangaAggregateById } from '@/api/mangadex/manga'
import { mangadexService } from '@/services'
import { Card, CardBody, Image, Tab, Tabs, Chip, Skeleton, Button } from '@heroui/react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Flag } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft, BookOpen, User } from 'lucide-react'

export default function MangaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState<string>('en')

  const mangaId = params.manga_id as string

  const { data: mangaData, isLoading: isMangaLoading } = getMangaById({
    props: {
      param: { manga_id: mangaId },
      query: { 'includes[]': ['cover_art', 'author', 'artist'] },
    },
  })

  // Fetch all chapters to filter by language locally or just fetch specific language
  // For better UX, we might want to fetch 'en' by default or all and filter.
  // Let's try fetching specific language to reduce payload if possible, or just all.
  // The aggregate endpoint allows filtering.
  const { data: aggregateData, isLoading: isAggregateLoading } = getMangaAggregateById({
    props: {
      param: { manga_id: mangaId },
      query: { 'translatedLanguage[]': [selectedLang] },
    },
  })

  const manga = mangaData?.data?.data
  const attributes = manga?.attributes
  const relationships = manga?.relationships || []

  const coverArt = relationships.find((rel: any) => rel.type === 'cover_art')?.attributes?.fileName
  const author = relationships.find((rel: any) => rel.type === 'author')?.attributes?.name
  const artist = relationships.find((rel: any) => rel.type === 'artist')?.attributes?.name

  const title = attributes?.title?.en || Object.values(attributes?.title || {})[0]
  const description = attributes?.description?.en || Object.values(attributes?.description || {})[0]

  const chapters = useMemo(() => {
    const volumes = aggregateData?.data?.volumes || {}
    let allChapters: any[] = []

    Object.keys(volumes).forEach((volKey) => {
      const volume = volumes[volKey]
      Object.keys(volume.chapters).forEach((chKey) => {
        allChapters.push({
          ...volume.chapters[chKey],
          volume: volume.volume,
        })
      })
    })

    return allChapters.sort((a, b) => parseFloat(b.chapter) - parseFloat(a.chapter))
  }, [aggregateData])

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
        <div className="absolute top-4 left-4 z-20">
          <Button
            as={Link}
            href="/comic"
            variant="light"
            startContent={<ArrowLeft size={20} />}
            className="text-foreground/80 hover:text-foreground"
          >
            Back to Library
          </Button>
        </div>
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
              <Chip color={attributes?.status === 'completed' ? 'success' : 'primary'} variant="flat" size="sm">
                {attributes?.status?.toUpperCase()}
              </Chip>
              <Chip variant="flat" size="sm">
                {attributes?.publicationDemographic || 'Manga'}
              </Chip>
              {attributes?.contentRating && (
                <Chip color="danger" variant="flat" size="sm">
                  {attributes?.contentRating?.toUpperCase()}
                </Chip>
              )}
            </div>
          </div>

          {/* Right Column: Details & Chapters */}
          <div className="flex-1 space-y-6 pt-4 md:pt-16">
            <div>
              <h1 className="text-foreground mb-2 text-3xl font-bold md:text-5xl">{title}</h1>
              <div className="text-foreground-500 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {author && (
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{author}</span>
                  </div>
                )}
                {attributes?.year && <span> {attributes.year} </span>}
              </div>
            </div>

            <Card className="bg-content1/50 backdrop-blur-md">
              <CardBody className="p-4">
                <p className="text-foreground-600 text-sm leading-relaxed md:text-base">{description}</p>
              </CardBody>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <BookOpen size={20} />
                  Chapters
                </h2>

                <Tabs
                  aria-label="Languages"
                  selectedKey={selectedLang}
                  onSelectionChange={(key) => setSelectedLang(key as string)}
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

              {isAggregateLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : chapters.length === 0 ? (
                <div className="text-foreground-500 py-10 text-center">No chapters found for this language.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/comic/${mangaId}/${selectedLang}/${chapter.id}`}
                      className="group block"
                    >
                      <Card className="bg-content2 hover:bg-content3 border-l-primary w-full border-l-4 transition-colors">
                        <CardBody className="px-4 py-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="group-hover:text-primary text-lg font-bold transition-colors">
                              Ch. {chapter.chapter}
                            </span>
                            <span className="text-tiny text-foreground-400">Vol. {chapter.volume || '-'}</span>
                          </div>
                          {/* <span className="text-xs text-foreground-500 truncate">
                                                {format(new Date(), 'MMM dd, yyyy')}
                                            </span> */}
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
