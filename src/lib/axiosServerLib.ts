import axios, { AxiosError, AxiosResponse, type AxiosPromise } from 'axios'
import secretServer from '../config/secretServer'

// Default headers
export const headerAxios = {
  guest: { Accept: 'application/json' },
}

// Axios error normalizer
export const throwAxios = (err: any) => {
  if (err?.response) throw err.response
  if (err?.request) {
    throw {
      status: 400,
      data: { message: 'Unable to connect to the server. Check your internet connection.' },
    }
  }
  throw {
    status: 500,
    data: { message: 'An unidentified error occurred.' },
  }
}

export type TypeAxios<T> = AxiosPromise<T>
export type TypeResponse<T> = AxiosResponse<T>
export type TypeError<T> = AxiosError<T>

// Convert query object → query string
export const createQueryStr = (props?: { query?: Record<string, any> }): string => {
  const q = props?.query
  if (!q) return ''

  const params = Object.entries(q)
    .flatMap(([key, value]) => (Array.isArray(value) ? value.map((v) => `${key}=${v}`) : `${key}=${value}`))
    .join('&')

  return params ? `?${params}` : ''
}

// Axios instance
export const instance = axios.create({
  timeout: 5000,
  headers: headerAxios.guest,
  withCredentials: true,
})

// Main reusable API fetcher
interface FetcherProps<Query = any, Param = any, Payload = any> {
  query?: Query
  param?: Param
  payload?: Payload
  headers?: Record<string, string>
  baseURL?: string
}

const isFormData = (value: any) => typeof FormData !== 'undefined' && value instanceof FormData

export const createApiFetcher = <
  TQuery extends Record<string, any> | undefined = undefined,
  TParam = any,
  TPayload = any,
  TResponse = any,
>(config: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  endpoint: string | ((props?: FetcherProps<TQuery, TParam, TPayload>) => string)
  baseURL?: string
  headers?: Record<string, string>
}) => {
  return async (props?: FetcherProps<TQuery, TParam, TPayload>): TypeAxios<TResponse> => {
    try {
      const { query, payload, headers, baseURL } = props ?? {}

      // Endpoint dynamic/static
      const endpoint = typeof config.endpoint === 'function' ? config.endpoint(props) : config.endpoint

      // Detect absolute URL
      const isFullUrl = /^https?:\/\//i.test(endpoint)

      // Choose baseURL: props.baseURL > config.baseURL
      const base = isFullUrl ? '' : (baseURL ?? config.baseURL ?? '')

      // Final URL + querystring
      const url = base + endpoint + createQueryStr({ query })

      // Payload rules (Axios)
      const data = config.method === 'GET' ? undefined : isFormData(payload) ? payload : (payload ?? undefined)

      // Merge headers:
      // 1. Default guest header
      // 2. config.headers (global per fetcher)
      // 3. props.headers (per call override)
      const finalHeaders: Record<string, string> = {
        ...headerAxios.guest,
        ...(config.headers ?? {}),
        ...(headers ?? {}),
      }

      // FormData: remove Content-Type (biar Axios auto set boundary)
      if (isFormData(payload)) {
        delete finalHeaders['Content-Type']
      }

      return await instance({
        method: config.method,
        url,
        data,
        headers: finalHeaders,
      })
    } catch (err) {
      return throwAxios(err)
    }
  }
}

/*
  interface IProps {
    query?: {
      page?: number
      limit?: number
    }
    param: {
      id: string
    }
    payload: {
      username: string
    }
  }

  export const postChapterById = createApiFetcher<
    IProps["query"],    // query string
    IProps["param"],    // param di URL
    IProps["payload"],  // body payload
    any                 // tipe response
  >({
    method: "POST",
    baseURL: secretPublic.API_URL_MANGADEX,
    endpoint: (p) => `/chapter/${p?.param?.id}`
  })

  export const postChapterById = createApiFetcher<
    IProps["query"],    // query string
    IProps["param"],    // param di URL
    formData,           // body payload formData
    any                 // tipe response
  >({
    method: "POST",
    baseURL: secretPublic.API_URL_MANGADEX,
    endpoint: (p) => `/chapter/${p?.param?.id}`
  })
  postChapterById({
    payload: inputFormData
  })
*/
