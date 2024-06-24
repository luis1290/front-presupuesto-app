import { configureStore } from '@reduxjs/toolkit'
import isLoading from "./slices/isLoading.slice"
import dark from './slices/dark.slice'

export default configureStore({
  reducer: {
    isLoading, dark
  }
})