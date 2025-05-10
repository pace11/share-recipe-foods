/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ApiResponse, MutateResponse } from '@/types/api'
import type { Recipe } from '@/types/recipe'
import { MessageCircle, Heart, Bookmark } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { mutateApi } from '@/lib/api'
import { toast } from 'sonner'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

export default function Recipe() {
  const router = useRouter()
  const [openComment, setOpenComment] = useState<string>('')
  const { data, mutate } = useSWR<ApiResponse<Recipe>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/recipe/${router.query.id}`],
    ([url]) => fetcher(url),
  )

  const handleOnclick = async (
    type: 'liked' | 'saved',
    id: string,
    like: boolean | null,
  ) => {
    const url = {
      liked: `${process.env.NEXT_PUBLIC_URL_API}/${
        like ? 'unlike' : 'like'
      }/recipe/${id}`,
      saved: `${process.env.NEXT_PUBLIC_URL_API}/recipe/save/${id}`,
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
      mutate()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      toast('Error', {
        description: message,
        position: 'top-center',
      })
    }
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
