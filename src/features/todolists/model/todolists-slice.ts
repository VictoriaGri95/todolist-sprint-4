import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => {
    return {
      fetchTodolistAC: create.reducer<Todolist[]>((_state,action) => {

        return action.payload.map(todolist => {
          return {...todolist, filter: 'all'}})
      }),

      deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      }),

      changeTodolistTitleAC: create.reducer<{
        id: string
        title: string
      }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      }),

      changeTodolistFilterAC: create.reducer<{
        id: string
        filter: FilterValues
      }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.filter = action.payload.filter
        }
      }),

      createTodolistAC: create.preparedReducer(
        ({ title }: { title: string }) => {
          const newTodolist: DomainTodolist = {
            title,
            order: 0,
            filter: "all",
            id: nanoid(),
            addedDate: '',
          }
          return { payload: newTodolist }
        },
        (state, action) => {
          state.push(action.payload)
        },
      ),
    }
  },
})

export const { fetchTodolistAC, deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC } =
  todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer


export type DomainTodolist = Todolist & {
  filter: FilterValues
}
export type FilterValues = "all" | "active" | "completed"


export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
  try {
    const res = await todolistsApi.getTodolists()
    return { todolists: res.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(null)
  }
})

