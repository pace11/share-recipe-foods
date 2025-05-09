/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ApiResponse } from '@/types/api'
import { Recipe } from '@/types/recipe'
import { dateDistanceToNow } from '@/helpers'
import { MessageCircle, Heart } from 'lucide-react'
import Cookies from 'js-cookie'

type CardRecipeProps = {
  data?: ApiResponse<Recipe[]>
  onFinish: () => void
  onPrev: () => void
  onNext: () => void
}

export default function CardRecipe({
  data,
  onFinish,
  onPrev,
  onNext,
}: CardRecipeProps) {
  const recipes = data?.data

  const handleLikeRecipe = async ({
    like,
    id,
  }: {
    like: boolean
    id: string
  }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/${
          like ? 'unlike' : 'like'
        }/recipe/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('user_token')}`,
          },
        },
      )
      if (!!response.ok) {
        onFinish()
      }
    } catch (error) {}
  }

  if (!recipes) return null
  return (
    <>
      {recipes?.map((recipe) => (
        <Card key={recipe.id}>
          <CardHeader>
            <CardTitle className="hover:underline hover:cursos-pointer">
              <Link href={`/recipe/${recipe.id}`}>{recipe.title}</Link>
            </CardTitle>
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
                  handleLikeRecipe({
                    like: recipe.is_liked_by_me,
                    id: recipe.id,
                  })
                }
              >
                <Heart
                  stroke={recipe.is_liked_by_me ? 'black' : 'currentColor'}
                  fill={recipe.is_liked_by_me ? 'black' : 'none'}
                />{' '}
                {`${recipe.likes_count || ''}`}
              </Button>
              <Button size="sm" variant="ghost">
                <MessageCircle /> {`${recipe.comments_count || ''}`}
              </Button>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
      <div className="flex justify-center items-center gap-4">
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
