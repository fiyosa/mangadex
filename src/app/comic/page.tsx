'use client'

import { getChapters } from '@/api/mangadex/chapter'
import { CardItem } from './_lib/CardItem'
import { CardSkeleton } from './_lib/CardSkeleton'
import { getCovers } from '@/api/mangadex/cover'
import { useEffect, useState, useRef, useCallback } from 'react'
import { addToast, Spinner } from '@heroui/react'

const LIMIT = 32

export default function ComicPage() {
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [_iChapters, _setIChapters] = useState({
    'order[readableAt]': 'desc',
  })
  const [_iCovers, _setICovers] = useState<any>({
    'includes[]': ['manga'],
    'manga[]': [],
  })

  const [_covers, _setCovers] = useState<any>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Ref untuk sentinel element (elemen di bawah untuk trigger infinite scroll)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchChapters = getChapters({
    props: {
      query: {
        'order[readableAt]': _iChapters?.['order[readableAt]'] as 'asc' | 'desc',
        limit: LIMIT,
        offset: offset,
        'translatedLanguage[]': ['en', 'id'],
        'includes[]': ['user'],
      },
    },
  })

  const fetchCovers = getCovers({
    props: {
      query: {
        'manga[]': _iCovers['manga[]'],
        'includes[]': _iCovers['includes[]'],
        limit: LIMIT,
        offset: 0,
      },
    },
    enabled: _iCovers['manga[]'].length > 0,
  })

  // Cek apakah masih loading (hanya untuk initial load)
  const isInitialLoading = offset === 0 && (fetchChapters.isPending || fetchCovers.isPending || fetchCovers.isFetching)

  // Fungsi untuk load more data
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !fetchChapters.isPending && !fetchCovers.isPending) {
      setIsLoadingMore(true)
      setOffset((prev) => prev + LIMIT)
    }
  }, [isLoadingMore, hasMore, fetchChapters.isPending, fetchCovers.isPending])

  // IntersectionObserver untuk detect scroll ke bawah
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Jika sentinel terlihat dan masih ada data lagi
        // Tambahkan _covers.length > 0 agar tidak trigger sebelum data awal dimuat
        if (entries[0].isIntersecting && hasMore && !isInitialLoading && !isLoadingMore && _covers.length > 0) {
          loadMore()
        }
      },
      {
        root: null, // viewport
        rootMargin: '100px', // trigger 100px sebelum sampai bawah
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isInitialLoading, isLoadingMore, loadMore, _covers.length])

  useEffect(() => {
    if (fetchChapters.isError) {
      addToast({ title: 'error', description: fetchChapters.error?.data?.message ?? 'anjay', color: 'danger' })
      setIsLoadingMore(false)
    }

    if (fetchChapters.isSuccess && !fetchChapters.isPending) {
      const chaptersData = fetchChapters.data?.data?.data ?? []

      // Cek apakah masih ada data lagi
      if (chaptersData.length < LIMIT) {
        setHasMore(false)
      }

      let manga_ids = []
      for (const chapter of chaptersData) {
        manga_ids.push(chapter?.relationships[1]?.id ?? null)
      }

      _setICovers((e: any) => ({ ...e, 'manga[]': manga_ids }))
    }
  }, [fetchChapters.status])

  useEffect(() => {
    if (fetchCovers.isError) {
      setIsLoadingMore(false)
    }

    if (fetchCovers.isSuccess && !fetchCovers.isPending) {
      let newCovers = []
      let anjay = null
      for (const chapter of fetchChapters.data?.data?.data ?? []) {
        for (const cover of fetchCovers.data?.data?.data ?? []) {
          let manga_title = ''
          for (const element in cover?.relationships[0]?.attributes?.title ?? null) {
            if (element === 'en') {
              manga_title = cover?.relationships[0]?.attributes?.title[element]
              break
            }
            if (element === 'ja-ro') {
              manga_title = cover?.relationships[0]?.attributes?.title[element]
              break
            }
            manga_title = cover?.relationships[0]?.attributes?.title[element]
          }

          if (chapter?.relationships[1]?.id === cover?.relationships[0]?.id) {
            if (!anjay) {
              anjay = chapter
            }
            newCovers.push({
              cover_id: cover?.id,
              manga_id: cover?.relationships[0]?.id,
              manga_img: cover?.attributes?.fileName,
              manga_title,
              manga_user_name: chapter?.relationships[2]?.attributes?.username,
              chapter_published_at: chapter?.attributes?.publishAt,
              chapter_number: chapter?.attributes?.chapter,
              chapter_language: chapter?.attributes?.translatedLanguage,
              chapter_id: chapter?.id,
            })
          }
        }
      }

      // Append ke existing covers (untuk infinite scroll)
      if (offset === 0) {
        _setCovers(newCovers)
      } else {
        _setCovers((prev: any) => [...prev, ...newCovers])
      }

      setIsLoadingMore(false)
    }
  }, [fetchCovers.status])

  // Refetch ketika offset berubah
  useEffect(() => {
    if (offset > 0) {
      fetchChapters.refetch()
    }
  }, [offset])

  return (
    <div className="container mx-auto px-4 pt-2">
      <div className="w-full">
        <div className="grid grid-cols-[repeat(auto-fill,160px)] justify-center gap-4">
          {fetchChapters.isError ? (
            <div className="col-span-full flex h-60 w-full flex-col items-center justify-center gap-4">
              <p className="text-danger">Failed to fetch mangas</p>
              <button
                onClick={() => fetchChapters.refetch()}
                className="bg-primary hover:bg-primary/80 rounded-lg px-4 py-2 text-sm font-medium text-white"
              >
                Try Again
              </button>
            </div>
          ) : isInitialLoading ? (
            Array.from({ length: 16 }).map((_, index) => <CardSkeleton key={index} />)
          ) : (
            _covers.map((cover: any, index: number) => <CardItem key={index} cover={cover} />)
          )}

          {/* Loading skeleton saat load more */}
          {isLoadingMore && Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={`loading-more-${index}`} />)}
        </div>

        {/* Sentinel element untuk trigger infinite scroll */}
        <div ref={sentinelRef} className="flex h-20 w-full items-center justify-center">
          {isLoadingMore && <Spinner color="primary" size="lg" />}
          {!hasMore && _covers.length > 0 && (
            <p className="text-sm text-gray-500">Tidak ada lagi data untuk ditampilkan</p>
          )}
        </div>
      </div>
    </div>
  )
}
