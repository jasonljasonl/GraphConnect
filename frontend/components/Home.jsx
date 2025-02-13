import { useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login"; // Redirect if not logged in
    } else {
      (async () => {
        try {
          const { data } = await axios.get("http://127.0.0.1:8000/Home/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Include token in request
            },
          });
          setMessage(data.message);
        } catch (e) {
          console.log("Not authenticated", e);
          window.location.href = "/login"; // Redirect if unauthorized
        }
      })();
    }
  }, []);

  return (
    <div className="form-signin mt-5 text-center">
      <h3>Hi {message}</h3>
    </div>
  );
};
