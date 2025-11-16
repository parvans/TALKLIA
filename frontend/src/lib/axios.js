import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? 
    "http://localhost:5000/api" : 
    "https://talklia-3ttpqzch2-parvans-projects.vercel.app/api",
    withCredentials: true,
});