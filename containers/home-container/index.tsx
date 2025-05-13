/* eslint-disable @typescript-eslint/no-unused-vars */
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus } from 'lucide-react'
import { Actions } from './actions'

const FormRecipe = dynamic(() => import('@/components/common/form-recipe'))
const CardRecipe = dynamic(() => import('@/components/common/card-recipe'))
const ReplyRecipe = dynamic(() => import('@/components/common/reply-recipe'))

export default function HomeContainer() {
  const {
    show,
    setShow,
    page,
    openComment,
    setOpenComment,
    valueEdit,
    setValueEdit,
    data,
    isLoading,
    handlePagination,
    mutate,
  } = Actions()

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-end sticky top-15">
          <Button size="sm" onClick={() => setShow(true)}>
            <MessageSquarePlus /> Create Recipe
          </Button>
        </div>
        <CardRecipe
          data={data}
          loading={isLoading}
          onFinish={() => mutate()}
          onPrev={() => handlePagination(page - 1)}
          onNext={() => handlePagination(page + 1)}
          onComment={(value) => setOpenComment(value)}
          onEdit={(id, title, content) => {
            setShow(id)
            setValueEdit({
              title,
              content,
            })
          }}
        />
      </div>
      <FormRecipe
        open={show}
        onOpen={() => {
          setShow((prevState) => !prevState)
          setValueEdit({ title: '', content: '' })
        }}
        onFinish={() => mutate()}
        values={valueEdit}
      />
      <ReplyRecipe
        open={openComment}
        onOpen={() => {
          setOpenComment('')
          handlePagination(page)
        }}
      />
    </>
  )
}
