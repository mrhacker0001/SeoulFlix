import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    deadline: null,
};

const maintenanceSlice = createSlice({
    name: "maintenance",
    initialState,
    reducers: {
        setDeadline: (state, action) => {
            state.deadline = action.payload;
        },
    },
});

export const { setDeadline } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;