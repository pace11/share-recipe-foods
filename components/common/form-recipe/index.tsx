/* eslint-disable @typescript-eslint/no-unused-vars */
import dynamic from 'next/dynamic'
import {
  Drawer,
  DrawerTitle,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import useFormAction from '@/hooks/useFormAction'
import { Input } from '@/components/ui/input'
import { schemaRecipe } from '@/types/form'
import { mutateApi } from '@/lib/api'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { MutateResponse } from '@/types/api'

const Quill = dynamic(() => import('react-quill'), { ssr: false })

type FormRecipeProps = {
  open: boolean | string
  title?: string
  onOpen: () => void
  onFinish: () => void
  values?: z.infer<typeof schemaRecipe>
}

export default function FormRecipe({
  open,
  title = 'Form Recipe',
  values,
  onOpen,
  onFinish,
}: FormRecipeProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { form } = useFormAction({
    schema: schemaRecipe,
    defaultValues: {
      title: '',
      content: '',
    },
    values,
  })

  const onSubmitClick = () => {
    formRef.current?.requestSubmit()
  }

  const onSubmit = async (values: z.infer<typeof schemaRecipe>) => {
    const isEditing = typeof open === 'string'

    setLoading(true)
    try {
      const response = await mutateApi<MutateResponse<null>>(
        `/recipe${isEditing ? `/${open}` : ''}`,
        isEditing ? 'PATCH' : 'POST',
        values,
      )
      onFinish()
      toast('Info', {
        description: response.message || '',
        position: 'top-center',
      })
      handleClose()
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

  const handleClose = () => {
    onOpen()
    form.reset()
  }

  return (
    <Drawer open={!!open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle className="text-center">{title}</DrawerTitle>
        <div className="max-h-[90vh] overflow-y-auto container p-4 w-full max-w-sm mx-auto">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <div className="border rounded-md overflow-hidden">
                        <Quill {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <div className="flex gap-2 justify-end p-4 container w-full max-w-sm mx-auto">
            <Button size="sm" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => onSubmitClick()}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Save'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
