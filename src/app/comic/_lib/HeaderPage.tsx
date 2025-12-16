import { BtnTheme } from '@/components/ui'
import Link from 'next/link'

export default function HeaderPage() {
  return (
    <div className="bg-background/80 sticky top-0 z-50 w-full border-b-1 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-13 w-full items-center justify-between">
          <Link href="/comic">
            <h1 className="cursor-pointer text-xl font-bold">Skuy</h1>
          </Link>
          <Link href="/comic/search">
            <h2 className="cursor-pointer text-lg font-semibold">search</h2>
          </Link>
          <BtnTheme />
        </div>
      </div>
    </div>
  )
}
