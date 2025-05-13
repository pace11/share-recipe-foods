import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { User2, LogOut } from 'lucide-react'
import { User } from '@/types/user'

type CardProfileProps = {
  user?: User
  loading: boolean
  onLogout: () => void
}

export default function CardProfile({
  user,
  loading,
  onLogout,
}: CardProfileProps) {
  if (loading)
    return (
      <Card className="p-8">
        <div className="space-y-2">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      </Card>
    )

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          <Button size="sm" variant="ghost">
            <User2 />
            {`${user?.name}`}
          </Button>
        </CardTitle>
        <CardDescription>{user?.email}</CardDescription>
        <CardDescription>
          <Button size="sm" variant="outline" onClick={() => onLogout()}>
            <LogOut />
            Logout
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
