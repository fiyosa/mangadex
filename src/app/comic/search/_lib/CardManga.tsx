'use client'

import { TooltipUI } from '@/components/ui'
import { mangadexService } from '@/services'
import { Image } from '@heroui/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { useState, useCallback } from 'react'

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

interface IProps {
  manga: {
    id: string
    title: string
    cover_filename: string
    author?: string
    year?: number
    status?: string
    rating?: number
  }
}

export const CardManga = (props: IProps) => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [imageKey, setImageKey] = useState(0)

  // Handle error with retry
  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1)
        setImageKey((prev) => prev + 1)
      }, RETRY_DELAY)
    } else {
      setIsLoading(false)
      setIsError(true)
    }
  }, [retryCount])

  return (
    <Link
      className={`group relative flex h-60 w-40 cursor-pointer flex-col overflow-hidden rounded-3xl ${theme === 'dark' ? 'bg-slate-200' : 'bg-[#0F0F1A]'} p-1 shadow-lg`}
      href={'/comic/' + props.manga.id}
    >
      <TooltipUI size="sm" color="secondary" content={props.manga.title} placement={'bottom'}>
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-300">
          {/* Skeleton shimmer animation */}
          {isLoading && !isError && (
            <div className="absolute inset-0 z-10 animate-pulse bg-linear-to-r from-slate-300 via-slate-200 to-slate-300" />
          )}
          {/* Error state */}
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
            </div>
          )}
          <Image
            key={imageKey}
            src={
              props.manga.cover_filename
                ? mangadexService.getImageCover(props.manga.id, props.manga.cover_filename)
                : '/placeholder.jpg' // Fallback if no cover
            }
            alt={props.manga.title}
            width={300}
            height={300}
            className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-[2px] ${isLoading || isError ? 'opacity-0' : 'opacity-100'}`}
            loading="eager"
            onLoad={() => setIsLoading(false)}
            onError={handleError}
          />
          {/* Overlay */}
          {!isError && (
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-all duration-300 group-hover:from-black/90 group-hover:via-black/50 group-hover:to-black/30" />
          )}
          {/* Top badge - Status */}
          <div className="absolute top-0 left-0 z-20 flex w-full items-start justify-between p-2">
            <div className="flex flex-col items-start gap-1">
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-md ${props.manga.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
              >
                {props.manga.status || 'Unknown'}
              </span>
              {props.manga.rating && (
                <div className="flex w-fit items-center gap-0.5 rounded-sm bg-black/50 px-1 text-[10px] text-yellow-400">
                  <Star size={10} fill="currentColor" />
                  <span>{props.manga.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            {props.manga.year && (
              <span className="rounded-sm bg-black/50 px-1 text-[10px] text-white">{props.manga.year}</span>
            )}
          </div>
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 z-20 w-full p-3">
            {/* Author */}
            <div className="mb-0.5 flex items-center gap-1 text-xs text-white/70">
              <span
                className="truncate"
                style={{
                  textShadow:
                    '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000',
                }}
              >
                {props.manga.author || 'Unknown Author'}
              </span>
            </div>
            {/* Manga title */}
            <p
              className="line-clamp-2 text-sm font-bold text-white group-hover:drop-shadow-lg"
              style={{
                textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
              }}
            >
              {props.manga.title}
            </p>
          </div>
        </div>
      </TooltipUI>
    </Link>
  )
}
