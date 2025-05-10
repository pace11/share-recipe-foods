/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr'
import { fetcher } from '@/helpers'
import { Button } from '@/components/ui/button'
import { ApiResponse } from '@/types/api'
import { Recipe } from '@/types/recipe'
import { MessageSquarePlus } from 'lucide-react'
import { useState } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

import FormRecipe from '@/containers/form-recipe'
import CardRecipe from '@/containers/card-recipe'
import ReplyRecipe from '@/containers/reply-recipe'

export default function Home() {
  const [show, setShow] = useState<boolean | number>(false)
  const [page, setPage] = useState<number>(1)
  const [openComment, setOpenComment] = useState<string>('')
  const { data, isLoading, mutate } = useSWR<ApiResponse<Recipe[]>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/recipes?page=${page}`],
    ([url]) => fetcher(url),
  )

  const handlePagination = async (value: number) => {
    const newData = await fetcher(
      `${process.env.NEXT_PUBLIC_URL_API}/recipes?page=${value}`,
    )
    mutate(newData, false)
    setPage(value)
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-end sticky top-15">
          <Button size="sm" onClick={() => setShow(true)}>
            <MessageSquarePlus />
          </Button>
        </div>
        <CardRecipe
          data={data}
          loading={isLoading}
          onFinish={() => mutate()}
          onPrev={() => handlePagination(page - 1)}
          onNext={() => handlePagination(page + 1)}
          onComment={(value) => setOpenComment(value)}
        />
      </div>
      <FormRecipe
        open={show}
        onOpen={() => setShow((prevState) => !prevState)}
        onFinish={() => mutate()}
      />
      <ReplyRecipe
        open={openComment}
        onOpen={() => {
          setOpenComment('')
          handlePagination(page)
        }}
      />
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
