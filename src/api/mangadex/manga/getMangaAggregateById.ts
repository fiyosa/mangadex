import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretServer from '@/config/secretServer'

interface IProps {
  param?: {
    manga_id?: string // uuid
  }
  query?: {
    'includes[]'?: ('manga' | 'cover_art' | 'author' | 'artist' | 'tag' | 'creator')[]
    'translatedLanguage[]'?: string[]
    'groups[]'?: string[] // uuid
  }
}

// get detail manga
export const fetchMangaAggregateById = axiosServerLib.createApiFetcher<
  IProps['query'],
  IProps['param'],
  undefined,
  any
>({
  method: 'GET',
  baseURL: secretServer.API_URL_MANGADEX,
  endpoint: (p) => '/manga/' + p?.param?.manga_id + '/aggregate',
})

export const getMangaAggregateById = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<any>, any>(
  'getMangaAggregateById',
  fetchMangaAggregateById
)
