import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretServer from '@/config/secretServer'
import { IGetAtHomeServer } from '@/model/mangadex/AtHome'

interface IProps {
  param: {
    chapter_id: string // uuid
  }
  query?: {
    forcePort443?: boolean
  }
}

// get list images
const fetchAtHomeServer = axiosServerLib.createApiFetcher<
  IProps['query'],
  IProps['param'],
  undefined,
  IGetAtHomeServer
>({
  method: 'GET',
  baseURL: secretServer.API_URL_MANGADEX,
  endpoint: (p) => `/at-home/server/${p?.param?.chapter_id}`,
})

export const getAtHomeServer = tanstackQueryLib.createQuery<IProps, axiosServerLib.TypeResponse<IGetAtHomeServer>>(
  'getAtHomeServer',
  fetchAtHomeServer
)
