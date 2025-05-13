/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr'
import { fetcher } from '@/helpers'

export default function useFetcher<T = any>({
  enabled = true,
  path,
}: {
  enabled?: boolean
  path?: string
}) {
  const { data, isLoading, isValidating, mutate } = useSWR<T>(
    [enabled ? `${process.env.NEXT_PUBLIC_URL_API}${path}` : ''],
    ([url]) => fetcher(url),
  )

  return { data, isLoading: isLoading || isValidating, mutate }
}
