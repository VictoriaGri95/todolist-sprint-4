import { createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createSlice({
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


  }),

  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.map((todolist) => ({
          ...todolist,
          filter: "all",
        }))
      })

      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {

        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        const newTodolist: DomainTodolist = {
          ...action.payload.item,
          filter: "all",
        }
        state.push(newTodolist)
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
  },
})

// Thunk
export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`,
  async (_arg, { rejectWithValue }) => {
    try {
      const res = await todolistsApi.getTodolists()
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (args: { id: string; title: string }, { rejectWithValue }) => {
    try {
      await todolistsApi.changeTodolistTitle(args)
      return args
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)


export const createTodolistTC = createAsyncThunk(
  'todolists/createTodolistTC',  // 👈 Убедитесь, что имя правильное
  async (title: string, { rejectWithValue }) => {
    try {

      const res = await todolistsApi.createTodolist(title)

      return { item: res.data.data.item}

    } catch (error) {
      console.log('🔥 createTodolistTC: ошибка:', error)
      return rejectWithValue(error)
    }
  }
)

export const deleteTodolistTC = createAsyncThunk(`${todolistsSlice.name}/deleteTodolistTC`, async (id: string, {rejectWithValue})=> {
  try {
  await todolistsApi.deleteTodolist(id)
    return {id}


    //   .then(() => {
    //   setTodolists(todolists.filter((todolist) => todolist.id !== id))
    //   delete tasks[id]
    //   setTasks({ ...tasks })
    // })


  } catch (error) {
    return rejectWithValue(error)
  }
})
export const { selectTodolists } = todolistsSlice.selectors
export const {  changeTodolistFilterAC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & { filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"
