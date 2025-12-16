'use client'

import { getMangas } from '@/api/mangadex/manga'
import { CardSkeleton } from '@/app/comic/_lib/CardSkeleton'
import { CardManga } from './_lib/CardManga'
import { Input, Button, Spinner } from '@heroui/react'
import { Search as SearchIcon } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'

const LIMIT = 32

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [offset, setOffset] = useState(0)
  const [mangas, setMangas] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== debouncedTerm) {
        setDebouncedTerm(searchTerm)
        setOffset(0)
        setMangas([])
        setHasMore(true)
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { data, isPending, isError, refetch } = getMangas({
    props: {
      query: {
        title: debouncedTerm,
        limit: LIMIT,
        offset: offset,
        'includes[]': ['cover_art', 'author'],
        'contentRating[]': ['safe', 'suggestive', 'erotica', 'pornographic'],
      },
    },
    enabled: debouncedTerm.length > 0,
  })

  // Append data when fetched
  useEffect(() => {
    if (data?.data?.data) {
      const newMangas = data.data.data.map((manga: any) => {
        const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art')
        const author = manga.relationships.find((rel: any) => rel.type === 'author')
        const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'Unknown Title'

        return {
          id: manga.id,
          title: title,
          cover_filename: coverArt?.attributes?.fileName,
          author: author?.attributes?.name,
          year: manga.attributes.year,
          status: manga.attributes.status,
        }
      })

      if (newMangas.length < LIMIT) {
        setHasMore(false)
      }

      setMangas((prev) => (offset === 0 ? newMangas : [...prev, ...newMangas]))
      setIsLoadingMore(false)
    }
  }, [data])

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isPending) {
      setIsLoadingMore(true)
      setOffset((prev) => prev + LIMIT)
    }
  }, [isLoadingMore, hasMore, isPending])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending && mangas.length > 0) {
          loadMore()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isPending, mangas.length, loadMore])

  return (
    <div className="container mx-auto min-h-screen px-4 py-6">
      <div className="mb-8 flex flex-col items-center gap-4">
        <h1 className="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-3xl font-bold text-transparent">
          Search Comics
        </h1>
        <div className="w-full max-w-md">
          <Input
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search manga..."
            startContent={<SearchIcon className="text-default-400" />}
            size="lg"
            variant="flat"
            classNames={{
              inputWrapper:
                'bg-default-100 hover:bg-default-200 group-data-[focus=true]:bg-default-100 transition-colors',
            }}
            isClearable
            onClear={() => setSearchTerm('')}
          />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,160px)] justify-center gap-4">
        {isPending && offset === 0 && debouncedTerm
          ? Array.from({ length: 16 }).map((_, index) => <CardSkeleton key={index} />)
          : mangas.map((manga, index) => <CardManga key={`${manga.id}-${index}`} manga={manga} />)}

        {isLoadingMore && Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={`loading-${index}`} />)}
      </div>

      {mangas.length === 0 && (!isPending || !debouncedTerm) && (
        <div className="mt-10 flex flex-col items-center justify-center text-gray-500">
          <p>No results found for "{debouncedTerm}"</p>
        </div>
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} className="mt-4 flex h-20 w-full items-center justify-center">
        {isLoadingMore && <Spinner color="secondary" />}
        {!hasMore && mangas.length > 0 && <p className="text-sm text-gray-500">End of results</p>}
      </div>
    </div>
  )
}
