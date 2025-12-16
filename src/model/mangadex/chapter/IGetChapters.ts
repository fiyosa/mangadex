export type IGetChapters = {
  result: string
  response: string
  data: Array<{
    id: string
    type: string
    attributes: {
      title: string
      volume: string
      chapter: string
      pages: number
      translatedLanguage: string
      uploader: string
      externalUrl: string
      version: number
      createdAt: string
      updatedAt: string
      publishAt: string
      readableAt: string
      isUnavailable: boolean
    }
    relationships: Array<{
      id: string
      type: string
      related: string
      attributes: any
    }>
  }>
  limit: number
  offset: number
  total: number
}
