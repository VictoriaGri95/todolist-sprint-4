import { createSlice, nanoid } from "@reduxjs/toolkit"
import {
  createTodolistTC,
  deleteTodolistTC
} from "./todolists-slice.ts"

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },

  reducers: (create) => ({
    deleteTaskAC: create.reducer<{
      todolistId: string
      taskId: string
    }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),

    // createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
    //   const newTask: Task = { title: action.payload.title, isDone: false, id: nanoid() }
    //   state[action.payload.todolistId].unshift(newTask)
    // }),
    createTaskAC: create.preparedReducer(
      (todolistId: string, title: string) => {
        const newTask: Task = {
          title,
          isDone: false,
          id: nanoid(),
        }
        return { payload: { todolistId, task: newTask } }
      },
      (state, action) => {
        const { todolistId, task } = action.payload
        if (state[todolistId]) {
          state[todolistId].unshift(task)
        } else {
          // Если массив не существует (тудулист еще создается),
          // создаем новый массив с этой задачей
          state[todolistId] = [task]
          // Или можно просто проигнорировать создание задачи:
          // console.warn(`Тудулист ${todolistId} еще не инициализирован`)
        }
      },
    ),

    changeTaskStatusAC: create.reducer<{
      todolistId: string
      taskId: string
      isDone: boolean
    }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.isDone = action.payload.isDone
      }
    }),

    changeTaskTitleAC: create.reducer<{
      todolistId: string
      taskId: string
      title: string
    }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),

  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.item.id] = []
      })

      .addCase(deleteTodolistTC.fulfilled, (state, action) => {

        delete state[action.payload.id]
      })
  },
})

export const { selectTasks } = tasksSlice.selectors
export const { deleteTaskAC, createTaskAC, changeTaskTitleAC, changeTaskStatusAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
