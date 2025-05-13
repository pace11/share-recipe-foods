import useFormAction from '@/hooks/useFormAction'
import { schemaLogin } from '@/types/form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { authStore } from '@/store/authStore'
import { mutateApi } from '@/lib/api'
import { LoginResponse, MutateResponse } from '@/types/api'

export const Actions = () => {
  const router = useRouter()
  const setIsLoggedIn = authStore((s) => s.setIsLoggedIn)
  const [loading, setLoading] = useState<boolean>(false)
  const { form } = useFormAction({
    schema: schemaLogin,
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof schemaLogin>) => {
    setLoading(true)
    try {
      const response = await mutateApi<MutateResponse<LoginResponse>>(
        `${process.env.NEXT_PUBLIC_URL_API}/auth/login`,
        'POST',
        values,
      )
      setIsLoggedIn(response.data?.expires || '', response.data?.token || '')
      router.reload()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      toast('Error', {
        description: message,
        position: 'top-center',
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    form,
    onSubmit,
  }
}
