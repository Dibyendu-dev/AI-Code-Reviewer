import axios from "axios";

const API = "http://127.0.0.1:8000/api/auth/";

export const register = (data) =>
  axios.post(`${API}register/`, data);

export const login = (data) =>
  axios.post(`${API}login/`, data);