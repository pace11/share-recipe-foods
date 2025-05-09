import { User } from './user'

export type Comment = {
  id: string
  recipe_id: string
  content: string
  is_mine: boolean
  created_at: string
  updated_at: string
  user: User
}
