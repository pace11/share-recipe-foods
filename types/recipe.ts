import { User } from './user'

export type Recipe = {
  id: string
  title: string
  content: string
  likes_count: number
  comments_count: number
  is_liked_by_me: boolean
  is_saved_by_me: boolean
  is_mine: boolean
  created_at: string
  updated_at: string
  user: User
}

export type RecipeSave = {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
  updated_at: string
  user: User
  recipe: Recipe
}
