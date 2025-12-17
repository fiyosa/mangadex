import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretPublic from '@/config/secretPublic'

interface IProps {
  param: {
    manga_id: string // uuid
  }
  query?: {
    'includes[]': ('manga' | 'cover_art' | 'author' | 'artist' | 'tag' | 'creator')[]
  }
}

// get detail manga
export const fetchMangaById = axiosServerLib.createApiFetcher<IProps['query'], IProps['param'], undefined, any>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: (p) => '/manga/' + p?.param?.manga_id,
})

export const getMangaById = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<any>, any>(
  'getMangaById',
  fetchMangaById
)
