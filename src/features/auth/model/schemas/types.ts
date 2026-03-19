import { loginSchema } from "@/features/auth/model/schemas/loginSchema.ts"
import * as z from "zod"

export type LoginInputs = z.infer<typeof loginSchema>
