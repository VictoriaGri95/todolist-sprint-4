import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { SyntheticEvent } from "react"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectError, setAppErrorAC } from "@/app/app-slice.ts"

export const ErrorSnackBar = () => {
  const error = useAppSelector(selectError)
  const dispatch = useAppDispatch()

  const handleClose = (_event?: SyntheticEvent | Event, _reason?: SnackbarCloseReason) => {
    dispatch(setAppErrorAC({ error: null }))
  }

  return (
    <Snackbar open={error !== null} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" variant="filled">
        {error}
      </Alert>
    </Snackbar>
  )
}
