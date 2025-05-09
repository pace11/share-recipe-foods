/* eslint-disable @typescript-eslint/no-unused-vars */
// import { dateDistanceToNow, fetcher } from '@/helpers'
import useSWR from 'swr'
import { fetcher, dateDistanceToNow } from '@/helpers'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ReplyRecipe from '@/containers/reply-recipe'
import { ApiResponse } from '@/types/api'
import type { Recipe } from '@/types/recipe'
import { MessageCircle, Heart } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

export default function Recipe() {
  const router = useRouter()
  const [openComment, setOpenComment] = useState<string>('')
  const { data, mutate: mutateRecipe } = useSWR<ApiResponse<Recipe>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/recipe/${router.query.id}`],
    ([url]) => fetcher(url),
  )

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
        mutateRecipe()
      }
    } catch (error) {}
  }

  if (!data?.data) return null
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
                  handleLikeRecipe({
                    like: data.data.is_liked_by_me,
                    id: data.data.id,
                  })
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
            </CardDescription>
          </CardHeader>
        </Card>
        <ReplyRecipe
          open={openComment}
          onOpen={() => {
            setOpenComment('')
            mutateRecipe()
          }}
        />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const cookies = parse(context.req.headers.cookie || '')
  const token = cookies?.user_token
    ? jwt.verify(cookies.user_token, process.env.SECRET_KEY!)
    : false

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
