import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretServer from '@/config/secretServer'

interface IProps {
  param: {
    manga_id: string // uuid
  }
}

// get detail manga
export const fetchStatisticByMangaId = axiosServerLib.createApiFetcher<undefined, IProps['param'], undefined, any>({
  method: 'GET',
  baseURL: secretServer.API_URL_MANGADEX,
  endpoint: (p) => '/statistics/manga/' + p?.param?.manga_id,
})

export const getStatisticByMangaId = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<any>, any>(
  'getStatisticByMangaId',
  fetchStatisticByMangaId
)
