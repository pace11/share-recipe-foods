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
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Drawer, DrawerTitle, DrawerContent } from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { schemaCommentRecipe } from '@/types/form'
import useFormAction from '@/hooks/useFormAction'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api'
import { Comment } from '@/types/comment'
import { fetcher } from '@/helpers'
import Cookies from 'js-cookie'
import { dateDistanceToNow } from '@/helpers'
import { z } from 'zod'
import { useState } from 'react'

type ReplyRecipeProps = {
  open: string
  onOpen: () => void
}

export default function ReplyRecipe({ open, onOpen }: ReplyRecipeProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { data: comments, mutate } = useSWR<ApiResponse<Comment[]>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/comments/recipe/${open}`],
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/comment/recipe/${open}`,
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
        mutate()
        toast('Info', {
          description: data?.message || '',
          position: 'top-center',
        })
        form.reset()
      }
    } catch (error) {
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
            {comments?.data.map((comment) => (
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
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
