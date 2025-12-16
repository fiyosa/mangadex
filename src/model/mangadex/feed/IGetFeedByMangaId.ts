export type IGetFeedByMangaId = {
  result: string
  response: string
  data: Array<{
    id: string
    type: string
    attributes: {
      volume: any
      chapter: string
      title?: string
      translatedLanguage: string
      externalUrl: any
      isUnavailable: boolean
      publishAt: string
      readableAt: string
      createdAt: string
      updatedAt: string
      version: number
      pages: number
    }
    relationships: Array<{
      id: string
      type: string
      attributes?: {
        username?: string
        roles?: Array<string>
        version: number
        name?: string
        altNames?: Array<{
          en: string
        }>
        locked?: boolean
        website?: string
        ircServer: any
        ircChannel?: string
        discord?: string
        contactEmail?: string
        description?: string
        twitter?: string
        mangaUpdates: any
        focusedLanguages?: Array<string>
        official?: boolean
        verified?: boolean
        inactive?: boolean
        publishDelay: any
        exLicensed?: boolean
        createdAt?: string
        updatedAt?: string
      }
    }>
  }>
  limit: number
  offset: number
  total: number
}
