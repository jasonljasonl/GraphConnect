import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageComponent from "./MessageComponent";
import axios from "axios";


export default function ChatPage() {
  const { recipientId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/account/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, []);


    const getAuthorUsername = (id) => {
    const user = users.find((user) => user.id === parseInt(recipientId));
    return user ? user.username : "Unknown";
  };

  const getAuthorProfilePicture = (id) => {
    const user = users.find((user) => user.id === parseInt(recipientId));
    return user ? user.profile_picture : "/default-profile.png";
  };



  return (
    <div>
        <div className="user_chatting_with">
            <img
                src={getAuthorProfilePicture(recipientId)}
                alt=""
                className="author_profile_picture_component"
                id="user_chatting_profile_picture"
             />

            <h3>{getAuthorUsername(recipientId)}</h3>
       </div>
      <MessageComponent recipientId={recipientId} />
    </div>
  );
}
