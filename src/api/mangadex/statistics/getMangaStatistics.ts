import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretPublic from '@/config/secretPublic'

export interface IGetMangaStatistics {
  result: string
  statistics: {
    [mangaId: string]: {
      rating: {
        average: number
        bayesian: number
      }
      follows: number
    }
  }
}

interface IProps {
  query?: {
    'manga[]'?: string[]
  }
}

export const fetchMangaStatistics = axiosServerLib.createApiFetcher<
  IProps['query'],
  undefined,
  undefined,
  IGetMangaStatistics
>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: () => '/statistics/manga',
})

export const getMangaStatistics = tanstackQueryLib.createQuery<
  IProps,
  axiosServerLib.TypeResponse<IGetMangaStatistics>,
  any
>('getMangaStatistics', fetchMangaStatistics)
