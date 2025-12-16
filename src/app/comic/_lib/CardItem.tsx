'use client'

import { getMangaById } from '@/api/mangadex/manga'
import { Flag, TooltipUI } from '@/components/ui'
import flag from '@/config/flag'
import { mangadexService } from '@/services'
import { formatTimeToPublishWIB } from '@/utils/dateUtil'
import { Image } from '@heroui/react'
import { useTheme } from 'next-themes'
import NextImage from 'next/image'
import Link from 'next/link'
import { useState, useCallback } from 'react'

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 5 detik

const getLanguageFlag = (lang: string): string => {
  return flag[lang?.toLowerCase()] || 'XX'
}

interface IProps {
  cover: {
    cover_id: any
    manga_id: any
    manga_img: any
    manga_title: any
    manga_user_name: any
    chapter_id: any
    chapter_published_at: any
    chapter_number: any
    chapter_language: any
  }
}

export const CardItem = (props: IProps) => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [imageKey, setImageKey] = useState(0) // Key untuk force re-render Image

  // Handle error dengan retry
  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      // Tunggu sebelum retry
      setTimeout(() => {
        setRetryCount((prev) => prev + 1)
        setImageKey((prev) => prev + 1) // Force re-render Image
      }, RETRY_DELAY)
    } else {
      // Sudah 3x gagal, tampilkan error
      setIsLoading(false)
      setIsError(true)
    }
  }, [retryCount])

  return (
    <Link
      className={`group relative flex h-60 w-40 cursor-pointer flex-col overflow-hidden rounded-3xl ${theme === 'dark' ? 'bg-slate-200' : 'bg-[#0F0F1A]'} p-1 shadow-lg`}
      href={'/comic/' + props.cover.manga_id}
    >
      <TooltipUI size="sm" color="secondary" content={props.cover.manga_title} placement={'bottom'}>
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-300">
          {/* Skeleton shimmer animation */}
          {isLoading && !isError && (
            <div className="absolute inset-0 z-10 animate-pulse bg-linear-to-r from-slate-300 via-slate-200 to-slate-300" />
          )}

          {/* Error state - broken image icon */}
          {isError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-400 transition-all duration-300 group-hover:blur-[2px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-12 w-12 text-slate-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />
            </div>
          )}

          <Image
            key={imageKey}
            // as={NextImage}
            src={mangadexService.getImageCover(props.cover.manga_id, props.cover.manga_img)}
            alt={props.cover.manga_title}
            width={300}
            height={300}
            className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-[2px] ${isLoading || isError ? 'opacity-0' : 'opacity-100'}`}
            loading="eager"
            onLoad={() => setIsLoading(false)}
            onError={handleError}
          />
          {/* Overlay gradient - darker on hover */}
          {!isError && (
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-all duration-300 group-hover:from-black/90 group-hover:via-black/50 group-hover:to-black/30" />
          )}

          {/* Top badge - Flag & Chapter */}
          <div className="absolute top-0 left-0 z-20 flex w-full items-center justify-between p-2">
            <Flag svg countryCode={getLanguageFlag(props.cover.chapter_language)} />
            <span className="bg-primary rounded-md px-1.5 py-0.5 text-xs font-semibold text-white shadow-md">
              Ch. {props.cover.chapter_number || '?'}
            </span>
          </div>

          {/* Bottom info - User, Publish time & Title */}
          <div className="absolute bottom-0 left-0 z-20 w-full p-3">
            {/* Publish time */}
            {/* Publish time */}
            <span
              className="mb-1 block text-xs text-white/80"
              style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
            >
              {formatTimeToPublishWIB(props.cover.chapter_published_at)}
            </span>
            {/* User name */}
            <div className="mb-0.5 flex items-center gap-1 text-xs text-white/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-3 w-3"
                style={{ filter: 'drop-shadow(1px 1px 0 #000) drop-shadow(-1px -1px 0 #000)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <span
                className="truncate"
                style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
              >
                {props.cover.manga_user_name || 'Unknown'}
              </span>
            </div>
            {/* Manga title */}
            <p
              className="line-clamp-2 text-sm font-bold text-white group-hover:drop-shadow-lg"
              style={{
                textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
              }}
            >
              {props.cover.manga_title}
            </p>
          </div>
        </div>
      </TooltipUI>
    </Link>
  )
}
