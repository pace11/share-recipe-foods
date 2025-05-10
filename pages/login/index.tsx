/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Input } from '@/components/ui/input'
import useFormAction from '@/hooks/useFormAction'
import { schemaLogin } from '@/types/form'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'
import { authStore } from '@/store/authStore'
import { mutateApi } from '@/lib/api'
import { LoginResponse, MutateResponse } from '@/types/api'

export default function Login() {
  const setIsLoggedIn = authStore((s) => s.setIsLoggedIn)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
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

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>LOGIN</CardTitle>
        <CardDescription>Form Data</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <p className="text-center">
                {`Don't have an account ? `}
                <Link href="/register" className="font-bold hover:underline">
                  Register Here
                </Link>
              </p>
              <Button className="w-full" type="submit">
                {loading ? 'Loading ...' : 'Login'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const cookies = parse(context.req.headers.cookie || '')
  const token = cookies?.user_token
    ? jwt.verify(cookies.user_token, process.env.SECRET_KEY!)
    : false

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
