import * as z from "zod"
import { todolistSchema } from "@/features/todolists/model/schemas/schemasForTodolists.ts"

export type Todolist = z.infer<typeof todolistSchema>
