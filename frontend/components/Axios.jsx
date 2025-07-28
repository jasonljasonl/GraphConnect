import axios from "axios";

let refreshInProgress = false;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.interceptors.response.use(
  (response) => response, 
  async (error) => {
    if (error.response && error.response.status === 401 && !refreshInProgress) {
      refreshInProgress = true; 

      try {
        console.log(localStorage.getItem("refresh_token"));

        const response = await axios.post(
          `${API_BASE_URL}/token/refresh/`,
          {
            refresh: localStorage.getItem("refresh_token"),
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, 
          }
        );

        if (response.status === 200) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);

          return axios(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
      } finally {
        refreshInProgress = false; 
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
