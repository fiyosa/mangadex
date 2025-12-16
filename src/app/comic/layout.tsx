import HeaderPage from './_lib/HeaderPage'

export default function ComicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full flex-col">
      <HeaderPage />
      {children}
    </div>
  )
}
