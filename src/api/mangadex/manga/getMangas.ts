import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretPublic from '@/config/secretPublic'

export interface IGetMangas {
  result: string
  response: string
  data: Array<{
    id: string
    type: string
    attributes: {
      title: {
        [key: string]: string
      }
      altTitles: Array<{
        [key: string]: string
      }>
      description: {
        [key: string]: string
      }
      isLocked: boolean
      links: {
        [key: string]: string
      }
      originalLanguage: string
      lastVolume: string
      lastChapter: string
      publicationDemographic: string
      status: string
      year: number
      contentRating: string
      tags: Array<{
        id: string
        type: string
        attributes: {
          name: {
            [key: string]: string
          }
          description: {
            [key: string]: string
          }
          group: string
          version: number
        }
        relationships: Array<{
          id: string
          type: string
        }>
      }>
      state: string
      chapterNumbersResetOnNewVolume: boolean
      createdAt: string
      updatedAt: string
      version: number
      availableTranslatedLanguages: Array<string>
      latestUploadedChapter: string
    }
    relationships: Array<{
      id: string
      type: string
      related?: string
      attributes?: any
    }>
  }>
  limit: number
  offset: number
  total: number
}

interface IProps {
  query?: {
    title?: string
    limit?: number
    offset?: number
    'ids[]'?: string[]
    'includes[]'?: ('manga' | 'cover_art' | 'author' | 'artist' | 'tag')[]
    'contentRating[]'?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[]
    'order[followedCount]'?: 'desc' | 'asc'
    'order[relevance]'?: 'desc' | 'asc'
  }
}

export const fetchMangas = axiosServerLib.createApiFetcher<IProps['query'], undefined, undefined, IGetMangas>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: () => '/manga',
})

export const getMangas = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<IGetMangas>, any>(
  'getMangas',
  fetchMangas
)
