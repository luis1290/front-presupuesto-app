import { configureStore } from '@reduxjs/toolkit'
import isLoading from "./slices/isLoading.slice"
import dark from './slices/dark.slice'
import spentsUser from './slices/spentsUser.slice'
import incomeUser from './slices/incomeUser.slice'
import totalSpents from './slices/totalSpent.slice'
import incomeBalance from './slices/incomeBalance.slice'
import categoryIncome from './slices/categoryIncome.slice'
import categorySpent from './slices/categorySpent.slice'

export default configureStore({
  reducer: {
    isLoading, dark, spentsUser, totalSpents, incomeUser, incomeBalance, categoryIncome, categorySpent
  }
})