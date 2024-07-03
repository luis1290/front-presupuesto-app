import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../helpers/getConfig';
import axios from 'axios';
import { setIsLoading } from './isLoading.slice';

// Cambiamos mySlice por el nombre de nuestro slice (usersSlice, toDosSlice...)
export const incomeDataRange = createSlice({
  name: 'incomeDataRange',
  initialState: {},
  reducers: {
    setIncomeDataRange: (state, action) => {
      return action.payload
    }
  }
})

const token = localStorage.getItem("token")

export const getIconDataRangeThunk = (id) => dispatch => {
  dispatch(setIsLoading(true));
  axios.get(`http://localhost:8000/getincomdatarange/${id}`, getConfig())
    .then((resp) => {
      console.log(resp.data)
      dispatch(setIncomeDataRange(resp.data))
    })
    .catch(error => {
      if (token) {
        console.log(error.response.data)
        localStorage.clear();
      } else if (token === null) {
        console.log("State 403, However, you just have to log in to solve it. :)")
      } else {
        console.log(error)
      }
    })
    .finally(() => dispatch(setIsLoading(false)))
}




export const { setIncomeDataRange } = incomeDataRange.actions;

export default incomeDataRange.reducer;