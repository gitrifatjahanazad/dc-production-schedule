import axios from "axios";
const { REACT_APP_API_BASE_URL } = process.env;
const BASE_URL = `${REACT_APP_API_BASE_URL}/`;
export default axios.create({
  baseURL: BASE_URL,
});

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
