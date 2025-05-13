import { useState } from 'react'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse } from '@/types/api'
import { Recipe } from '@/types/recipe'
import { fetcher } from '@/helpers'

export const Actions = () => {
  const [show, setShow] = useState<boolean | string>(false)
  const [page, setPage] = useState<number>(1)
  const [openComment, setOpenComment] = useState<string>('')
  const [valueEdit, setValueEdit] = useState<{
    title: string
    content: string
  }>({
    title: '',
    content: '',
  })

  const { data, isLoading, mutate } = useFetcher<ApiResponse<Recipe[]>>({
    path: `/recipes?page=${page}`,
  })

  const handlePagination = async (value: number) => {
    const newData = await fetcher(
      `${process.env.NEXT_PUBLIC_URL_API}/recipes?page=${value}`,
    )
    mutate(newData, false)
    setPage(value)
  }

  return {
    show,
    setShow,
    page,
    setPage,
    openComment,
    setOpenComment,
    valueEdit,
    setValueEdit,
    data,
    isLoading,
    handlePagination,
    mutate,
  }
}
