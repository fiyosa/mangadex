'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ToastProvider } from '@heroui/toast'

export default function HeroUiProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <ToastProvider placement="top-right" />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
