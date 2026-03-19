import * as z from "zod"
import {
  domainTaskSchema,
  getTasksResponseSchema,
  updateTaskModelSchema,
} from "@/features/todolists/model/schemas/schemasForTasks.ts"

export type DomainTask = z.infer<typeof domainTaskSchema>
export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>
export type UpdateTaskModel = z.infer<typeof updateTaskModelSchema>


// export type GetTasksResponse = {
//   error: string | null
//   totalCount: number
//   items: DomainTask[]
// }

// export type UpdateTaskModel = {
//   description: string | null
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
//   startDate: string | null
//   deadline: string | null
// }
