import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../helpers/getConfig';
import axios from 'axios';
import { setIsLoading } from './isLoading.slice';

// Cambiamos mySlice por el nombre de nuestro slice (usersSlice, toDosSlice...)
export const incomesUserSlice = createSlice({
  name: 'incomeUser',
  initialState: {},
  reducers: {
    setIncomeUserSlice: (state, action) => {
      return action.payload
    }
  }
})

const token = localStorage.getItem("token")

export const getIncomeUserThunk = (id) => dispatch => {
  dispatch(setIsLoading(true));
  axios.get(`http://localhost:8000/getallincome/${id}`, getConfig())
    .then((resp) => {
      console.log(resp.data)
      dispatch(setIncomeUserSlice(resp.data))
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




export const { setIncomeUserSlice } = incomesUserSlice.actions;

export default incomesUserSlice.reducer;