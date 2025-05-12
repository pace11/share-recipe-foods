import useSWR from 'swr'
import { fetcher } from '@/helpers'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { User2, LogOut } from 'lucide-react'
import { ApiResponse } from '@/types/api'
import { User } from '@/types/user'
import { Recipe, RecipeSave } from '@/types/recipe'
import CardRecipe from '@/containers/card-recipe'
import CardRecipeSave from '@/containers/card-recipe-save'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'
import { authStore } from '@/store/authStore'
import FormRecipe from '@/containers/form-recipe'

export default function Profile() {
  const logout = authStore((s) => s.logout)
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [pageSaves, setPageSaves] = useState<number>(1)
  const [showEdit, setShowEdit] = useState<boolean | string>(false)
  const [valueEdit, setValueEdit] = useState({
    title: '',
    content: '',
  })
  const { data: userData } = useSWR<ApiResponse<User>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/user/me`],
    ([url]) => fetcher(url),
  )
  const {
    data: recipesData,
    isLoading: isLoadingRecipe,
    mutate,
  } = useSWR<ApiResponse<Recipe[]>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/recipes?type=me&page=${page}`],
    ([url]) => fetcher(url),
  )
  const {
    data: recipeSaveData,
    isLoading: isLoadingRecipeSave,
    mutate: mutateRecipeSave,
  } = useSWR<ApiResponse<RecipeSave[]>>(
    [`${process.env.NEXT_PUBLIC_URL_API}/recipe/saves?page=${pageSaves}`],
    ([url]) => fetcher(url),
  )
  const user = userData?.data

  const handlePagination = async (value: number) => {
    const newData = await fetcher(
      `${process.env.NEXT_PUBLIC_URL_API}/recipes?type=me&page=${value}`,
    )
    mutate(newData, false)
    setPage(value)
  }

  const handlePaginationRecipeSaves = async (value: number) => {
    const newData = await fetcher(
      `${process.env.NEXT_PUBLIC_URL_API}/recipe/saves?page=${value}`,
    )
    mutateRecipeSave(newData, false)
    setPageSaves(value)
  }

  const handleLogout = () => {
    toast('Info', {
      description: 'Success logout',
      position: 'top-center',
    })
    logout()
    setTimeout(() => {
      router.reload()
    }, 1000)
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              <Button size="sm" variant="ghost">
                <User2 />
                {`${user?.name}`}
              </Button>
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <CardDescription>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleLogout()}
              >
                <LogOut />
                Logout
              </Button>
            </CardDescription>
          </CardHeader>
        </Card>
        <Tabs defaultValue="recipes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recipes">My Recipes</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="recipes">
            <div className="grid grid-cols-1 gap-4">
              <CardRecipe
                data={recipesData}
                loading={isLoadingRecipe}
                onFinish={() => mutate()}
                onPrev={() => handlePagination(page - 1)}
                onNext={() => handlePagination(page + 1)}
                onEdit={(id, title, content) => {
                  setShowEdit(id)
                  setValueEdit({
                    title,
                    content,
                  })
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="grid grid-cols-1 gap-4">
              <CardRecipeSave
                data={recipeSaveData}
                loading={isLoadingRecipeSave}
                onFinish={() => mutateRecipeSave()}
                onPrev={() => handlePaginationRecipeSaves(pageSaves - 1)}
                onNext={() => handlePaginationRecipeSaves(pageSaves + 1)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FormRecipe
        open={showEdit}
        onOpen={() => {
          setShowEdit((prevState) => !prevState)
          setValueEdit({ title: '', content: '' })
        }}
        onFinish={() => mutate()}
        values={valueEdit}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const cookies = parse(context.req.headers.cookie || '')
  const token = cookies?.user_token
    ? jwt.verify(cookies.user_token, process.env.SECRET_KEY!)
    : false

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
