import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'

type QueryHookProps<TProps, TData, TError> = { props?: TProps } & Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
>

export const createQuery = <TProps, TData = any, TError = unknown>(
  key: string,
  fetcher: (props?: TProps) => Promise<TData>
) => {
  return ({ props, ...optional }: QueryHookProps<TProps, TData, TError> = {}) => {
    return useQuery<TData, TError>({
      queryKey: [key, props],
      queryFn: () => fetcher(props),
      ...optional,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    })
  }
}

type MutateHookProps<TProps, TData, TError> = {
  props?: TProps
} & Omit<UseMutationOptions<TData, TError>, 'mutationKey' | 'mutationFn'>

export const createMutate = <TProps, TData = any, TError = unknown>(
  key: string,
  fetcher: (props?: TProps) => Promise<TData>
) => {
  return ({ props, ...optional }: MutateHookProps<TProps, TData, TError> = {}) => {
    return useMutation<TData, TError>({
      mutationKey: [key, props],
      mutationFn: () => fetcher(props),
      ...optional,
    })
  }
}
