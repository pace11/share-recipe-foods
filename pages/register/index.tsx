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
import { schemaRegister } from '@/types/form'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

export default function Register() {
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
      const response = await (
        await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/register`, {
          method: 'POST',
          body: JSON.stringify(values),
        })
      ).json()

      if (!response?.errors?.message) {
        router.push('/login')
        return toast('Success', {
          description: response.message,
          position: 'top-center',
        })
      }

      return toast('Error', {
        description: response?.errors?.message || 'Error Message',
        position: 'top-center',
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>REGISTER</CardTitle>
        <CardDescription>Form Create Data</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="address ..." {...field} />
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
                Already have an account ?{' '}
                <Link href="/login" className="font-bold hover:underline">
                  Login Here
                </Link>
              </p>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Register'}
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
