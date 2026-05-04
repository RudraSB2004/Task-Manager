import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default API;
