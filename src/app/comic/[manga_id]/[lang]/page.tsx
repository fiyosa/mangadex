import { redirect } from 'next/navigation'

export default function ComicLang({ children }: Readonly<{ children: React.ReactNode }>) {
  return redirect('/comic')
}
