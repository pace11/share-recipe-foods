/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Drawer, DrawerTitle, DrawerContent } from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { schemaCommentRecipe } from '@/types/form'
import useFormAction from '@/hooks/useFormAction'
import { ApiResponse, MutateResponse } from '@/types/api'
import { Comment } from '@/types/comment'
import { fetcher } from '@/helpers'
import { dateDistanceToNow } from '@/helpers'
import { z } from 'zod'
import { useState } from 'react'
import { mutateApi } from '@/lib/api'
import { toast } from 'sonner'

type ReplyRecipeProps = {
  open: string
  onOpen: () => void
}

export default function ReplyRecipe({ open, onOpen }: ReplyRecipeProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { data: comments, mutate } = useSWR<ApiResponse<Comment[]>>(
    [open ? `${process.env.NEXT_PUBLIC_URL_API}/comments/recipe/${open}` : ''],
    ([url]) => fetcher(url),
  )
  const { form } = useFormAction({
    schema: schemaCommentRecipe,
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof schemaCommentRecipe>) => {
    setLoading(true)
    try {
      const response = await mutateApi<MutateResponse>(
        `${process.env.NEXT_PUBLIC_URL_API}/comment/recipe/${open}`,
        'POST',
        values,
      )
      toast('Info', {
        description: response?.message || '',
        position: 'top-center',
      })
      mutate()
      form.reset()
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

  const handleOpenChange = () => {
    onOpen()
    form.reset()
  }

  return (
    <Drawer open={!!open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerTitle className="text-center">Comments</DrawerTitle>
        <div className="max-h-[90vh] overflow-y-auto container p-4 container relative w-full max-w-sm mx-auto">
          <div className="grid grid-cols-1 gap-4">
            <div className="sticky top-0">
              <Card>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-2"
                    >
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="comment here ..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="w-full" disabled={loading}>
                        {loading ? 'Loading ...' : 'Comment'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            {comments?.data?.map((comment) => (
              <Card key={comment.id}>
                <CardHeader>
                  <CardTitle>
                    {comment.is_mine ? 'Me' : comment.user.name}{' '}
                    <small>
                      {' '}
                      {`(${dateDistanceToNow(comment.created_at)})`}
                    </small>
                  </CardTitle>
                  <CardDescription>{comment.content}</CardDescription>
                </CardHeader>
              </Card>
            )) || null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
