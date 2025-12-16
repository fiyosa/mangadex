import { axiosServerLib } from '@/lib'
import secretServer from '@/config/secretServer'

export const getLatestComments = async (): axiosServerLib.TypeAxios<any> => {
  return axiosServerLib
    .instance({
      method: 'get',
      url: secretServer.API_URL_COMIC_ART + '/api/latest-comments',
    })
    .then((res) => res)
    .catch((res) => axiosServerLib.throwAxios(res))
}
