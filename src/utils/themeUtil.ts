import theme from '@/config/theme'

export const set = (e: string | null) => {
  if (!e || !theme.list.includes(e)) {
    window.localStorage.setItem('theme', 'light')
    e = 'light'
  }
  document.documentElement.setAttribute('data-theme', e)
  return e
}
