import { beforeEach, expect, test } from "vitest"
import { createTaskTC, deleteTaskTC, tasksReducer, type TasksState, updateTaskTC } from "../tasks-slice.ts"
import { createTodolistTC, deleteTodolistTC } from "../todolists-slice.ts"
import { TaskPriority, TaskStatus } from "@/common/enums"

let startState: TasksState = {}
const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0,
}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  }
})

test("correct task should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled(
      { todolistId: "todolistId2", taskId: "2" }, // payload
      "requestId", // requestId
      { todolistId: "todolistId2", taskId: "2" }, // arg
    ),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(2)
  expect(endState.todolistId2.find((t) => t.id === "2")).toBeUndefined()
  expect(endState.todolistId2[0].title).toBe("bread")
  expect(endState.todolistId2[1].title).toBe("tea")
})

test("correct task should be created at correct array", () => {
  const newTask = {
    id: "4",
    title: "juice",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled(
      { task: newTask }, // payload
      "requestId", // requestId
      { todolistId: "todolistId2", title: "juice" }, // arg
    ),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBe("4")
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status", () => {
  const updatedTask = {
    ...startState.todolistId2[1],
    status: TaskStatus.New,
  }

  const endState = tasksReducer(startState, updateTaskTC.fulfilled({ task: updatedTask }, "requestId", updatedTask))

  expect(endState.todolistId2[1].status).toBe(TaskStatus.New)
  expect(endState.todolistId2[1].title).toBe("milk") // title не изменился
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed) // другие не изменились
})

test("correct task should change its title", () => {
  const updatedTask = {
    ...startState.todolistId2[1],
    title: "coffee",
  }

  const endState = tasksReducer(startState, updateTaskTC.fulfilled({ task: updatedTask }, "requestId", updatedTask))

  expect(endState.todolistId2[1].title).toBe("coffee")
  expect(endState.todolistId2[1].status).toBe(TaskStatus.Completed) // status не изменился
  expect(endState.todolistId1[1].title).toBe("JS") // другие не изменились
})

test("array should be created for new todolist", () => {
  const newTodolist = {
    id: "todolistId3",
    title: "New todolist",
    addedDate: new Date().toISOString(),
    order: 0,
  }

  const endState = tasksReducer(
    startState,
    createTodolistTC.fulfilled({ todolist: newTodolist }, "requestId", "New todolist"),
  )

  const keys = Object.keys(endState)
  expect(keys.length).toBe(3)
  expect(endState["todolistId3"]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTodolistTC.fulfilled({ id: "todolistId2" }, "requestId", "todolistId2"),
  )

  const keys = Object.keys(endState)
  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).toBeUndefined()
})
