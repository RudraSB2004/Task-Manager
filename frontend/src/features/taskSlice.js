import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasks: (state, action) => action.payload,
  },
});

export const { setTasks } = slice.actions;
export default slice.reducer;
