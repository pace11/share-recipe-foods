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
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Actions } from './actions'

export default function LoginContainer() {
  const { loading, form, onSubmit } = Actions()

  return (
    <Card>
      <div className="flex items-center justify-center">
        <Image
          src="https://res.cloudinary.com/dby4ywiss/image/upload/v1747069090/app/share%20recipes/share-recipes_ipgcea.png"
          alt="share-recipes-foods"
          width={120}
          height={120}
        />
      </div>
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
