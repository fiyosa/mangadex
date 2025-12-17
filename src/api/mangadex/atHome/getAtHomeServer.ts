import { axiosServerLib, tanstackQueryLib } from '@/lib'
import { IGetAtHomeServer } from '@/model/mangadex/AtHome'
import secretPublic from '@/config/secretPublic'

interface IProps {
  param: {
    chapter_id: string // uuid
  }
  query?: {
    forcePort443?: boolean
  }
}

// get list images
export const fetchAtHomeServer = axiosServerLib.createApiFetcher<
  IProps['query'],
  IProps['param'],
  undefined,
  IGetAtHomeServer
>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: (p) => `/at-home/server/${p?.param?.chapter_id}`,
})

export const getAtHomeServer = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<IGetAtHomeServer>>(
  'getAtHomeServer',
  fetchAtHomeServer
)
