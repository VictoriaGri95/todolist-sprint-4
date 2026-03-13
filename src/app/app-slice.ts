import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{
      themeMode: ThemeMode
    }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatusAC: create.reducer<{
      status: RequestStatus
    }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{
      error: string | null
    }>((state, action) => {
      state.error = action.payload.error
    }),
  }),
})

export const { selectThemeMode, selectStatus, selectError } = appSlice.selectors
export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
