import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretPublic from '@/config/secretPublic'

interface IProps {
  query?: {
    'includes[]'?: ('manga' | 'user' | string)[]
    'manga[]'?: string[] // uuid
    limit?: number
    offset?: number
  }
}

// get cover detail
export const fetchCovers = axiosServerLib.createApiFetcher<IProps['query']>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: () => '/cover',
})

export const getCovers = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<any>>(
  'getCovers',
  fetchCovers
)
