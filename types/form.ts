import { z } from 'zod'

export const schemaRegister = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  password: z.string().min(4),
})

export const schemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

export const schemaRecipe = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export const schemaCommentRecipe = z.object({
  content: z.string().min(1),
})
