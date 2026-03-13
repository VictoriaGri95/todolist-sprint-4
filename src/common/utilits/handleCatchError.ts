import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { isAxiosError } from "axios"

export const handleCatchError = (error: unknown, dispatch: Dispatch) => {
  if (isAxiosError(error)) {
    dispatch(setAppErrorAC({ error: error.response?.data?.message || error.message }))
    //нативная ошибка
  } else if (error instanceof Error) {
    dispatch(setAppErrorAC({ error: error.message }))
  } else {
    dispatch(setAppErrorAC({ error: "Something went wrong" }))
  }
  dispatch(setAppStatusAC({ status: "failed" }))
  // dispatch(setAppStatusAC({ status: "failed" }))
  // dispatch(setAppErrorAC({ error: error.response?.data?.message || error.message }))
}
