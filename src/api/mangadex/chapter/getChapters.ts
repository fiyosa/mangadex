import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretServer from '@/config/secretServer'
import { IGetChapters } from '@/model/mangadex/chapter'

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
}

export const fetchChapters = axiosServerLib.createApiFetcher<IProps['query'], undefined, undefined, IGetChapters>({
  method: 'GET',
  baseURL: secretServer.API_URL_MANGADEX,
  endpoint: () => '/chapter',
})

export const getChapters = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<IGetChapters>, any>(
  'getChapters',
  fetchChapters
)
