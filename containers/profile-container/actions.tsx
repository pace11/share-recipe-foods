import { useState } from 'react'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse } from '@/types/api'
import { Recipe, RecipeSave } from '@/types/recipe'
import { fetcher } from '@/helpers'
import { authStore } from '@/store/authStore'
import { User } from '@/types/user'
import { toast } from 'sonner'
import { useRouter } from 'next/router'

export const Actions = () => {
  const logout = authStore((s) => s.logout)
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [pageSaves, setPageSaves] = useState<number>(1)
  const [openComment, setOpenComment] = useState<string>('')
  const [showEdit, setShowEdit] = useState<boolean | string>(false)
  const [valueEdit, setValueEdit] = useState<{
    title: string
    content: string
  }>({
    title: '',
    content: '',
  })

  const { data: userData, isLoading: isLoadingUserData } = useFetcher<
    ApiResponse<User>
  >({ path: '/user/me' })
  const {
    data: recipesData,
    isLoading: isLoadingRecipe,
    mutate: mutateRecipe,
  } = useFetcher<ApiResponse<Recipe[]>>({
    path: `/recipes?type=me&page=${page}`,
  })

  const {
    data: recipeSaveData,
    isLoading: isLoadingRecipeSave,
    mutate: mutateRecipeSave,
  } = useFetcher<ApiResponse<RecipeSave[]>>({
    path: `/recipe/saves?page=${pageSaves}`,
  })

  const handlePagination = async (value: number) => {
    const newData = await fetcher(
      `${process.env.NEXT_PUBLIC_URL_API}/recipes?type=me&page=${value}`,
    )
    mutateRecipe(newData, false)
    setPage(value)
  }

  const handlePaginationRecipeSaves = async (value: number) => {
    const newData = await fetcher(
      `${process.env.NEXT_PUBLIC_URL_API}/recipe/saves?page=${value}`,
    )
    mutateRecipeSave(newData, false)
    setPageSaves(value)
  }

  const handleLogout = () => {
    toast('Info', {
      description: 'Success logout',
      position: 'top-center',
    })
    logout()
    setTimeout(() => {
      router.reload()
    }, 1000)
  }

  return {
    user: userData?.data,
    isLoadingUserData,
    page,
    pageSaves,
    showEdit,
    setShowEdit,
    valueEdit,
    setValueEdit,
    recipesData,
    isLoadingRecipe,
    mutateRecipe,
    recipeSaveData,
    isLoadingRecipeSave,
    openComment,
    setOpenComment,
    mutateRecipeSave,
    handlePagination,
    handlePaginationRecipeSaves,
    handleLogout,
  }
}
