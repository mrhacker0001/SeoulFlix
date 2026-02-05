import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentPage: '',
};

const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {

        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        }
    }
});

export const {setCurrentPage } = navbarSlice.actions;

export default navbarSlice.reducer;
