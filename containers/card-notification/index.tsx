import { ApiResponse } from '@/types/api'
import { Card } from '@/components/ui/card'
import { Notification } from '@/types/notification'
import { Skeleton } from '@/components/ui/skeleton'
import { dateDistanceToNow } from '@/helpers'
import NoData from '@/components/common/no-data'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'

type CardNotificationProps = {
  data?: ApiResponse<Notification[]>
  loading?: boolean
}

const IconRender = (type?: string) => {
  const render = {
    like: (
      <Heart
        className="absolute top-1 right-4 z-0 opacity-10"
        size={50}
        fill="black"
      />
    ),
    save: (
      <Bookmark
        className="absolute top-1 right-4 z-0 opacity-10"
        size={50}
        fill="black"
      />
    ),
    comment: (
      <MessageCircle
        className="absolute top-1 right-4 z-0 opacity-10"
        size={50}
        fill="black"
      />
    ),
  }
  if (!type || !(type in render)) return render.like

  return render[type as keyof typeof render]
}

export default function CardNotification({
  data,
  loading,
}: CardNotificationProps) {
  const notifications = data?.data

  if (loading)
    return (
      <>
        {[...Array(3).keys()].map((index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </>
    )

  if (!notifications) return <NoData />

  return (
    <>
      {notifications?.map((notif) => (
        <Card key={notif.id} className="p-0">
          <div className="relative p-4">
            {IconRender(notif.type)}
            <div className="relative z-10">
              <p className="text-sm">
                {notif.message}{' '}
                <small>{`(${dateDistanceToNow(notif.created_at)})`}</small>
              </p>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
