/* eslint-disable @typescript-eslint/no-unused-vars */
import { Drawer, DrawerTitle, DrawerContent } from '@/components/ui/drawer'
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
import dynamic from 'next/dynamic'
import { schemaRecipe } from '@/types/form'
import { useRef } from 'react'
import Cookies from 'js-cookie'
import { z } from 'zod'
import { toast } from 'sonner'

const Quill = dynamic(() => import('react-quill'), { ssr: false })

type FormRecipeProps = {
  open: boolean | number
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
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/recipe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('user_token')}`,
          },
          body: JSON.stringify(values),
        },
      )
      const data = await response.json()

      if (!!response.ok) {
        onFinish()
        toast('Info', {
          description: data?.message || '',
          position: 'top-center',
        })
        handleClose()
      }
    } catch (error) {}
  }

  const handleClose = () => {
    onOpen()
    form.reset()
  }

  return (
    <Drawer open={!!open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle className="text-center">{title}</DrawerTitle>
        <div className="max-h-[90vh] overflow-y-auto container p-4 container relative w-full max-w-sm mx-auto">
          <div className="flex gap-2 justify-end sticky top-0">
            <Button size="sm" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => onSubmitClick()}>
              Save
            </Button>
          </div>
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
      </DrawerContent>
    </Drawer>
  )
}
