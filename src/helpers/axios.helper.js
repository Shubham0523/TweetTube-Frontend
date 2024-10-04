import axios from "axios";
// import { loadProgressBar } from "axios-progress-bar";
// import "axios-progress-bar/dist/nprogress.css";


const baseURL = "https://tweettube.onrender.com/";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// loadProgressBar({}, axiosInstance);
