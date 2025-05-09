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
import Cookies from 'js-cookie'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'
import { authStore } from '@/store/authStore'

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
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(values),
      })
      const data = await res.json()

      if (!!res.ok) {
        setIsLoggedIn(data?.data?.expires, data?.data?.token)
        toast('Info', {
          description: 'Login success',
          position: 'top-center',
        })
        router.reload()
        return
      }

      return toast('Error', {
        description: data?.message || '',
        position: 'top-center',
      })
    } catch (error) {}
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
                Register
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
