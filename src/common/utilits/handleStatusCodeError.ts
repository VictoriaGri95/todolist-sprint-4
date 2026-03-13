import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { BaseResponse } from "@/common/types"

export const handleStatusCodeError = <T>(dispatch: Dispatch, data: BaseResponse<T>) => {
  dispatch(setAppStatusAC({ status: "failed" }))
  const error = data.messages.length ? data.messages[0] : "Something went wrong."
  dispatch(setAppErrorAC({ error }))
}
