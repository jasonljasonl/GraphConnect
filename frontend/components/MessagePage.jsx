import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/MessagesPage.css";

export default function MessagePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/chat/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Vérifie si la réponse est un tableau
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("La réponse n'est pas un tableau:", response.data);
          setError("Failed to load users.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch chat users:", error);
        setError("Failed to load users.");
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {users.length === 0 ? (
          <li>No users found.</li>
        ) : (
          users.map((user) => (
            <li key={user.id}>
              <div className="user_message_div">
                <img
                  src={user.profile_picture || "/default-profile.png"}
                  alt={`Profile of ${user.username}`}
                  className="comment_author_profile_picture_component"
                  id="author_picture_message_page"
                />
                <p>{user.username}</p>
                <button onClick={() => navigate(`/messages/${user.id}`)}>💬</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
