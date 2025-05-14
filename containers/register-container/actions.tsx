import useFormAction from '@/hooks/useFormAction'
import { schemaRegister } from '@/types/form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { mutateApi } from '@/lib/api'
import { MutateResponse } from '@/types/api'

export const Actions = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { form } = useFormAction({
    schema: schemaRegister,
    defaultValues: {
      name: '',
      email: '',
      address: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof schemaRegister>) => {
    setLoading(true)
    try {
      const response = await mutateApi<MutateResponse<null>>(
        `/auth/register`,
        'POST',
        values,
      )

      toast('Success', {
        description: response.message,
        position: 'top-center',
      })
      router.push('/login')
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
