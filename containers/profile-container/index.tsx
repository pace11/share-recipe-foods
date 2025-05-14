import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Actions } from './actions'

const CardRecipeSave = dynamic(
  () => import('@/components/common/card-recipe-save'),
)
const CardRecipe = dynamic(() => import('@/components/common/card-recipe'))
const FormRecipe = dynamic(() => import('@/components/common/form-recipe'))
const CardProfile = dynamic(() => import('@/components/common/card-profile'))
const ReplyRecipe = dynamic(() => import('@/components/common/reply-recipe'))

export default function ProfileContainer() {
  const {
    user,
    isLoadingUserData,
    handleLogout,
    page,
    pageSaves,
    recipesData,
    isLoadingRecipe,
    mutateRecipe,
    recipeSaveData,
    isLoadingRecipeSave,
    mutateRecipeSave,
    handlePagination,
    handlePaginationRecipeSaves,
    showEdit,
    setShowEdit,
    valueEdit,
    setValueEdit,
    openComment,
    setOpenComment,
  } = Actions()

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <CardProfile
          user={user}
          loading={isLoadingUserData}
          onLogout={() => handleLogout()}
        />
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
                onFinish={() => {
                  mutateRecipe()
                  mutateRecipeSave()
                }}
                onPrev={() => handlePagination(page - 1)}
                onNext={() => handlePagination(page + 1)}
                onComment={(value) => setOpenComment(value)}
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
                onFinish={() => {
                  mutateRecipeSave()
                  mutateRecipe()
                }}
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
        onFinish={() => mutateRecipe()}
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
