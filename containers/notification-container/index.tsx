import useFetcher from '@/hooks/useFetcher'
import { ApiResponse } from '@/types/api'
import { Notification } from '@/types/notification'
import dynamic from 'next/dynamic'

const CardNotification = dynamic(
  () => import('@/components/common/card-notification'),
)

export default function NotificationContainer() {
  const { data, isLoading } = useFetcher<ApiResponse<Notification[]>>({
    path: '/notifications',
  })

  return (
    <div className="grid grid-cols-1 gap-4">
      <CardNotification data={data} loading={isLoading} />
    </div>
  )
}
