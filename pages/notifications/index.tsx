import CardNotification from '@/containers/card-notification'
import useSWR from 'swr'
import { fetcher } from '@/helpers'
import { ApiResponse } from '@/types/api'
import { Notification } from '@/types/notification'

export default function Notifications() {
  const { data, isLoading } = useSWR<ApiResponse<Notification[]>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/notifications`],
    ([url]) => fetcher(url),
  )
  return (
    <div className="grid grid-cols-1 gap-4">
      <CardNotification data={data} loading={isLoading} />
    </div>
  )
}
