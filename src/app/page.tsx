'use client'

import { themeUtil } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Btn } from '@/components/ui/Btn'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const getTheme = window.localStorage.getItem('theme')
    themeUtil.set(getTheme)
  }, [])

  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="bg-primary/20 pointer-events-none absolute top-0 left-0 h-96 w-full rounded-full opacity-50 mix-blend-screen blur-[120px]" />
      <div className="bg-secondary/20 pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full opacity-50 mix-blend-screen blur-[120px]" />

      <div className="z-10 max-w-4xl space-y-6 px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Discover Your Next <br />
          <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent">Favorite Comic</span>
        </h1>
        <p className="text-default-500 mx-auto max-w-2xl text-lg md:text-xl">
          Dive into a vast library of manga, manhwa, and comics. Experience seamless reading with our modern,
          blazing-fast reader.
        </p>

        <div className="pt-8">
          <Link href="/comic">
            <Btn size="lg" color="primary" variant="shadow" className="px-8 py-6 text-lg font-semibold">
              Start Reading Now
            </Btn>
          </Link>
        </div>
      </div>
    </div>
  )
}
