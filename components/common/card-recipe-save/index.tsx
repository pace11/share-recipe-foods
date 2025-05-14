/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import NoData from '@/components/common/no-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ApiResponse, MutateResponse } from '@/types/api'
import { RecipeSave } from '@/types/recipe'
import { dateDistanceToNow } from '@/helpers'
import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { mutateApi } from '@/lib/api'

type CardRecipePropsSave = {
  data?: ApiResponse<RecipeSave[]>
  loading?: boolean
  onFinish: () => void
  onPrev: () => void
  onNext: () => void
}

export default function CardRecipeSave({
  data,
  loading,
  onFinish,
  onPrev,
  onNext,
}: CardRecipePropsSave) {
  const recipes = data?.data

  const handleOnclick = async (id: string) => {
    try {
      const response = await mutateApi<MutateResponse<null>>(
        `/recipe/save/${id}`,
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
            <CardTitle className="hover:underline hover:cursos-pointer">
              <Link href={`/recipe/${recipe.recipe.id}`}>
                {recipe.recipe.title}
              </Link>
            </CardTitle>
            <CardDescription>{`by ${
              recipe.recipe.user.name
            }, ${dateDistanceToNow(
              recipe.recipe.created_at,
            )}`}</CardDescription>
            <CardDescription
              className="line-clamp-5"
              dangerouslySetInnerHTML={{ __html: recipe.recipe.content }}
            />
            <CardDescription>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOnclick(recipe.recipe.id)}
              >
                <Bookmark stroke="black" fill="black" />
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
