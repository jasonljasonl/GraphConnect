import axios from "axios";

let refreshInProgress = false; // Variable to prevent multiple refresh requests

axios.interceptors.response.use(
  (response) => response, // Pass valid responses unchanged
  async (error) => {
    if (error.response && error.response.status === 401 && !refreshInProgress) {
      refreshInProgress = true; // Prevent multiple refreshes

      try {
        console.log(localStorage.getItem("refresh_token"));

        // Request a new access token using the refresh token
        const response = await axios.post(
          "http://127.0.0.1:8000/token/refresh/",
          {
            refresh: localStorage.getItem("refresh_token"),
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Ensure credentials are included
          }
        );

        if (response.status === 200) {
          // Update the Authorization header with the new access token
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);

          // Retry the failed request with the new token
          return axios(error.config); // Retry the original request
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Optionally, you can log the user out or show a message here
      } finally {
        refreshInProgress = false; // Reset the flag after the refresh attempt
      }
    }

    // Propagate the original error if it wasn't a 401 or refresh failed
    return Promise.reject(error); // Handle the original error
  }
);
