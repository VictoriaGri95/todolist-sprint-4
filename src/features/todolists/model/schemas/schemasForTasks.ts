import * as z from "zod"
import { TaskPriority, TaskStatus } from "@/common/enums"

export const domainTaskSchema = z.object({
  description: z.string().nullable(), //null
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.iso.datetime({ local: true }),
})

export const getTasksResponseSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number(),
  items: z.array(domainTaskSchema),
  // items: DomainTask[],
})

export const updateTaskModelSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
})
