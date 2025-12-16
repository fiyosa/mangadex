'use client'

import { Loading } from '@/components/module/base'
import { themeUtil } from '@/utils'
import { useEffect, useState } from 'react'

export default function SetupProvider({ children }: { children: React.ReactNode }) {
  const [_pending, _setPending] = useState(true)

  useEffect(() => {
    _setPending(true)
    const getTheme = window.localStorage.getItem('theme')
    themeUtil.set(getTheme)
    _setPending(false)
  }, [])

  if (_pending) return <Loading />

  return <>{children}</>
}
