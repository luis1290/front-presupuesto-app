import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../helpers/getConfig';
import axios from 'axios';
import { setIsLoading } from './isLoading.slice';

// Cambiamos mySlice por el nombre de nuestro slice (usersSlice, toDosSlice...)
export const incomesBalanceUserSlice = createSlice({
    name: 'incomeBalance',
    initialState: {},
    reducers: {
        setIncomeBalanceUserSlice: (state, action) => {
            return action.payload
        }
    }
})

const token = localStorage.getItem("token")

export const getIncomeBalanceUserThunk = (id) => dispatch => {
    dispatch(setIsLoading(true));
    axios.get(`http://localhost:4500/getbalanceincome/${id}`, getConfig())
        .then((resp) => {
            console.log(resp.data)
            dispatch(setIncomeBalanceUserSlice(resp.data))
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




export const { setIncomeBalanceUserSlice } = incomesBalanceUserSlice.actions;

export default incomesBalanceUserSlice.reducer;