/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import NoData from '@/components/common/no-data'
import Link from 'next/link'
import { ApiResponse, MutateResponse } from '@/types/api'
import { Recipe } from '@/types/recipe'
import { dateDistanceToNow } from '@/helpers'
import {
  MessageCircle,
  Heart,
  Bookmark,
  Trash2Icon,
  Edit3Icon,
} from 'lucide-react'
import { toast } from 'sonner'
import { mutateApi } from '@/lib/api'

type CardRecipeProps = {
  data?: ApiResponse<Recipe[]>
  loading?: boolean
  onFinish: () => void
  onPrev: () => void
  onNext: () => void
  onComment?: (value: string) => void
  onEdit: (id: string, title: string, content: string) => void
}

export default function CardRecipe({
  data,
  loading,
  onFinish,
  onPrev,
  onNext,
  onComment,
  onEdit,
}: CardRecipeProps) {
  const recipes = data?.data

  const handleOnclick = async (
    type: 'liked' | 'saved',
    id: string,
    like: boolean | null,
  ) => {
    const url = {
      liked: `/${like ? 'unlike' : 'like'}/recipe/${id}`,
      saved: `/recipe/save/${id}`,
    }
    try {
      const response = await mutateApi<MutateResponse<null>>(
        `${url[type]}`,
        'POST',
      )
      toast('Info', {
        description: response?.message || '',
        position: 'top-center',
      })
      onFinish()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      toast('Error', {
        description: message,
        position: 'top-center',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await mutateApi<MutateResponse<null>>(
        `/recipe/${id}`,
        'DELETE',
      )
      toast('Info', {
        description: response?.message || '',
        position: 'top-center',
      })
      onFinish()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      toast('Error', {
        description: message,
        position: 'top-center',
      })
    }
  }

  if (loading)
    return (
      <>
        {[...Array(3).keys()].map((index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-4 w-[150px]" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </>
    )

  if (!recipes) return <NoData />

  return (
    <>
      {recipes?.map((recipe) => (
        <Card key={recipe.id}>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="hover:underline hover:cursos-pointer">
                <Link href={`/recipe/${recipe.id}`}>{recipe.title}</Link>
              </CardTitle>
              <div className="flex gap-2" hidden={!recipe.is_mine}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onEdit(recipe.id, recipe.title, recipe.content)
                  }
                >
                  <Edit3Icon />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2Icon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogDescription>
                        Are you sure you want to delete this data ?
                      </DialogDescription>
                      <DialogDescription>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          Yes
                        </Button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CardDescription>{`by ${
              recipe.is_mine ? 'Me' : recipe.user.name
            }, ${dateDistanceToNow(recipe.created_at)}`}</CardDescription>
            <CardDescription
              className="line-clamp-5"
              dangerouslySetInnerHTML={{ __html: recipe.content }}
            />
            <CardDescription>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  handleOnclick('liked', recipe.id, recipe.is_liked_by_me)
                }
              >
                <Heart
                  stroke={recipe.is_liked_by_me ? 'black' : 'currentColor'}
                  fill={recipe.is_liked_by_me ? 'black' : 'none'}
                />{' '}
                {`${recipe.likes_count || ''}`}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onComment?.(recipe.id)}
              >
                <MessageCircle /> {`${recipe.comments_count || ''}`}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOnclick('saved', recipe.id, null)}
              >
                <Bookmark
                  stroke={recipe.is_saved_by_me ? 'black' : 'currentColor'}
                  fill={recipe.is_saved_by_me ? 'black' : 'none'}
                />
              </Button>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
      <div
        className="flex justify-center items-center gap-4"
        hidden={(data?.meta?.total ?? 0) <= 10}
      >
        <Button onClick={() => onPrev()} disabled={data.meta?.page === 1}>
          Prev
        </Button>
        <p>{`${data.meta?.page}/${data.meta?.total_pages}`}</p>
        <Button
          onClick={() => onNext()}
          disabled={data.meta?.page === data.meta?.total_pages}
        >
          Next
        </Button>
      </div>
    </>
  )
}
