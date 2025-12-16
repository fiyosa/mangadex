'use client'

import { Button } from '@heroui/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export const BtnTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button isIconOnly size="sm" onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  )
}
