import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretPublic from '@/config/secretPublic'

interface IProps {
  param: {
    id: string // uuid: manga_id or cover_art
  }
  query?: {
    'includes[]': ('manga' | 'user')[]
  }
}

// get detail manga
export const fetchCoverById = axiosServerLib.createApiFetcher<IProps['query'], IProps['param']>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: (p) => `/cover/${p?.param?.id}`,
})

export const getCoverById = tanstackQueryLib.createQuery<IProps>('getCoverById', fetchCoverById)
