import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utilits/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums"
import { handleCatchError } from "@/common/utilits/handleCatchError.ts"
import { handleStatusCodeError } from "@/common/utilits/handleStatusCodeError.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(setAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(args)

          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(setAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),

    deleteTaskTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.deleteTask(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return args
          } else {
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(setAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),

    updateTaskTC: create.asyncThunk(
      async (task: DomainTask, { dispatch, rejectWithValue }) => {
        try {
          const model: UpdateTaskModel = {
            description: task.description,
            title: task.title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
          }
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({
            todolistId: task.todoListId,
            taskId: task.id,
            model,
          })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(setAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
            task.title = action.payload.task.title
          }
        },
      },
    ),
  }),
})

export const { selectTasks } = tasksSlice.selectors
export const { deleteTaskTC, updateTaskTC, fetchTasksTC, createTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
