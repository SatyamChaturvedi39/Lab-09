import axios from "axios";
const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
export default axios.create({ baseURL: API, responseType: 'json' });