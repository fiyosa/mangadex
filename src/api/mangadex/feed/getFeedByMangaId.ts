import { axiosServerLib, tanstackQueryLib } from '@/lib'
import secretPublic from '@/config/secretPublic'
import { IGetFeedByMangaId } from '@/model/mangadex/feed'

interface IProps {
  param: {
    manga_id: string // uuid
  }
  query?: {
    limit?: number
    offset?: number
    'translatedLanguage[]'?: string[]
    'originalLanguage[]'?: string[]
    'includes[]'?: string[]
    'contentRating[]'?: string[]
    'excludedGroups[]'?: string[]
    'excludedUploaders[]'?: string[]
    includeFutureUpdates?: '0' | '1'
    createdAtSince?: string
    updatedAtSince?: string
    publishAtSince?: string
    'order[createdAt]'?: 'asc' | 'desc'
    'order[updatedAt]'?: 'asc' | 'desc'
    'order[publishAt]'?: 'asc' | 'desc'
    'order[readableAt]'?: 'asc' | 'desc'
    'order[volume]'?: 'asc' | 'desc'
    'order[chapter]'?: 'asc' | 'desc'
  }
}

// get detail manga
export const fetchFeedByMangaId = axiosServerLib.createApiFetcher<
  IProps['query'],
  IProps['param'],
  undefined,
  IGetFeedByMangaId
>({
  method: 'GET',
  baseURL: secretPublic.API_URL_MANGADEX,
  endpoint: (p) => '/manga/' + p?.param?.manga_id + '/feed',
})

export const getFeedByMangaId = tanstackQueryLib.createQuery<
  IProps,
  axiosServerLib.TypeResponse<IGetFeedByMangaId>,
  any
>('getFeedByMangaId', fetchFeedByMangaId)
