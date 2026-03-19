import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"
import * as z from "zod"

export const handleCatchError = (error: unknown, dispatch: Dispatch) => {
  // if (isAxiosError(error)) {
  //   dispatch(setAppErrorAC({ error: error.response?.data?.message || error.message }))
  //   //нативная ошибка
  // } else if (error instanceof Error) {
  //   dispatch(setAppErrorAC({ error: error.message }))
  // } else {
  //   dispatch(setAppErrorAC({ error: "Something went wrong" }))
  // }
  // dispatch(setAppStatusAC({ status: "failed" }))
  let errorMessage

  switch (true) {
    case axios.isAxiosError(error):
      errorMessage = error.response?.data?.message || error.message
      break

    case error instanceof z.ZodError:
      console.table(error.issues)
      errorMessage = "Zod error. Смотри консоль"
      break

    case error instanceof Error:
      errorMessage = `Native error: ${error.message}`
      break

    default:
      errorMessage = JSON.stringify(error)
  }

  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setAppStatusAC({ status: "failed" }))
}
