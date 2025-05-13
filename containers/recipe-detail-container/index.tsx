import dynamic from 'next/dynamic'
import { dateDistanceToNow } from '@/helpers'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Heart, Bookmark } from 'lucide-react'
import { Actions } from './actions'

const NoData = dynamic(() => import('@/components/common/no-data'))
const ReplyRecipe = dynamic(() => import('@/components/common/reply-recipe'))

export default function RecipeDetailContainer() {
  const { data, mutate, openComment, setOpenComment, handleOnclick } = Actions()

  if (!data?.data) return <NoData />

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{data.data.title}</CardTitle>
            <CardDescription>{`by ${
              data.data.is_mine ? 'Me' : data.data.user.name
            }, ${dateDistanceToNow(data.data.created_at)}`}</CardDescription>
            <CardDescription
              dangerouslySetInnerHTML={{ __html: data.data.content }}
            />
            <CardDescription>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  handleOnclick('liked', data.data.id, data.data.is_liked_by_me)
                }
              >
                <Heart
                  stroke={data.data.is_liked_by_me ? 'black' : 'currentColor'}
                  fill={data.data.is_liked_by_me ? 'black' : 'none'}
                />{' '}
                {`${data.data.likes_count || ''}`}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpenComment(data.data.id)}
              >
                <MessageCircle /> {`${data.data.comments_count || ''}`}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOnclick('saved', data.data.id, null)}
              >
                <Bookmark
                  stroke={data.data.is_saved_by_me ? 'black' : 'currentColor'}
                  fill={data.data.is_saved_by_me ? 'black' : 'none'}
                />
              </Button>
            </CardDescription>
          </CardHeader>
        </Card>
        <ReplyRecipe
          open={openComment}
          onOpen={() => {
            setOpenComment('')
            mutate()
          }}
        />
      </div>
    </>
  )
}
