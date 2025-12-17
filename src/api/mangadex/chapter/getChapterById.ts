import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretPublic from '@/config/secretPublic'

interface IProps {
  query?: {
    forcePort443?: boolean
    'order[readableAt]'?: 'asc' | 'desc'
    'translatedLanguage[]'?: string[]
    'includes[]'?: ('user' | 'scanlation_group' | 'manga')[]
    'contentRating[]'?: ('safe' | 'suggestive' | 'erotica' | 'pornographic')[]
    limit?: number
    offset?: number
  }
  param: {
    chapter_id: string
  }
}

export const fetchChapterById = axiosServerLib.createApiFetcher<IProps['query'], IProps['param'], undefined, any>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: (p) => '/chapter/' + p?.param?.chapter_id,
})

export const getChapterById = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<any>, any>(
  'getChapterById',
  fetchChapterById
)
