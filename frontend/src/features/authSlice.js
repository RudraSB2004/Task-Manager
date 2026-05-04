import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    const item = localStorage.getItem("user");
    return item && item !== "undefined" ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token") || null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setAuth, logout } = slice.actions;
export default slice.reducer;
