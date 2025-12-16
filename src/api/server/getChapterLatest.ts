import { axiosServerLib } from '@/lib'
import secretServer from '@/config/secretServer'

interface IProps {
  query?: {
    order?: 'hot' | 'new' | any
    page?: number | any
    limit?: number | any
  }
}

export const getChapterLatest = async (props?: IProps): axiosServerLib.TypeAxios<any> => {
  return axiosServerLib
    .instance({
      method: 'get',
      url: secretServer.API_URL_COMIC_ART + '/api/chapters/latest' + axiosServerLib.createQueryStr(props),
    })
    .then((res) => res)
    .catch((res) => axiosServerLib.throwAxios(res))
}
