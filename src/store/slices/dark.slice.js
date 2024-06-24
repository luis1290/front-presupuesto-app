import { createSlice } from '@reduxjs/toolkit';

// Cambiamos mySlice por el nombre de nuestro slice (usersSlice, toDosSlice...)
export const darkSlice = createSlice({
    name: 'dark',
    initialState: false,
    reducers: {
        setDark: (state, action) => {
            return action.payload
        }
    }
})



export const { setDark } = darkSlice.actions;

export default darkSlice.reducer;