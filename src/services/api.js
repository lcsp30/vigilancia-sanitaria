import axios from "axios";

const api = axios.create({
  baseURL: "http://10.11.10.170:8000/api/",
});

export default api;