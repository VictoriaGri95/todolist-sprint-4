import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { createAppSlice } from "@/common/utilits/createAppSlice.ts"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums"
import { handleCatchError } from "@/common/utilits/handleCatchError.ts"
import { handleStatusCodeError } from "@/common/utilits/handleStatusCodeError.ts"
import { todolistSchema } from "@/features/todolists/model/schemas/schemasForTodolists.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },

  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{
      id: string
      filter: FilterValues
    }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    changeTodolistEntityStatusAC: create.reducer<{
      id: string
      entityStatus: RequestStatus
    }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    }),

    //thunk
    fetchTodolistsTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()

          todolistSchema.array().parse(res.data)

          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(setAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (_state, action) => {
          return action.payload?.todolists.map((tl) => {
            return { ...tl, filter: "all", entityStatus: "idle" }
          })
        },
      },
    ),

    createTodolistTC: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          if (res.data.resultCode === ResultCode.Success) {
            todolistSchema.parse(res.data.data.item)

            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { todolist: res.data.data.item }
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
          state.unshift({
            ...action.payload.todolist,
            filter: "all",
            entityStatus: "idle",
          })
        },
      },
    ),

    deleteTodolistTC: create.asyncThunk(
      async (id: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(
            changeTodolistEntityStatusAC({
              id,
              entityStatus: "loading",
            }),
          )
          const res = await todolistsApi.deleteTodolist(id)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { id }
          } else {
            dispatch(
              changeTodolistEntityStatusAC({
                id,
                entityStatus: "failed",
              }),
            )
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(
            changeTodolistEntityStatusAC({
              id,
              entityStatus: "failed",
            }),
          )
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(setAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (
        args: {
          id: string
          title: string
        },
        { dispatch, rejectWithValue },
      ) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.changeTodolistTitle(args)
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
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),
  }),
})

export const { selectTodolists } = todolistsSlice.selectors
export const {
  changeTodolistFilterAC,
  fetchTodolistsTC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistTitleTC,
  changeTodolistEntityStatusAC,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
