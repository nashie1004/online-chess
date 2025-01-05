import axios from 'axios'

const api = axios.create({
    baseURL: "https://localhost:44332", //import.meta.env.VITE_API_URL, // 44349
    withCredentials: true,
});

export default api;