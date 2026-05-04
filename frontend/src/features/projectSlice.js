import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    setProjects: (state, action) => action.payload,
  },
});

export const { setProjects } = slice.actions;
export default slice.reducer;
