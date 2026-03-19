import * as z from "zod"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(3),
  rememberMe: z.boolean(),
})
