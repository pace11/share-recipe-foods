import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, MutateResponse } from '@/types/api'
import type { Recipe } from '@/types/recipe'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { mutateApi } from '@/lib/api'
import { toast } from 'sonner'

export const Actions = () => {
  const router = useRouter()
  const [openComment, setOpenComment] = useState<string>('')
  const { data, mutate } = useFetcher<ApiResponse<Recipe>>({
    path: `/recipe/${router.query.id}`,
  })

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

  return { data, mutate, openComment, setOpenComment, handleOnclick }
}
