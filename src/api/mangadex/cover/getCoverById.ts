import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretServer from '@/config/secretServer'
import { IGetCoverById } from '@/model/mangadex/cover'

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
  baseURL: secretServer.API_URL_MANGADEX,
  endpoint: (p) => `/cover/${p?.param?.id}`,
})

export const getCoverById = tanstackQueryLib.createQuery<IProps>('getCoverById', fetchCoverById)
