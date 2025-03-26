import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageComponent from "./MessageComponent";
import { getUsers } from "../services/api";

export default function ChatPage() {
  const { recipientId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUsers();
        const foundUser = response.data.find((user) => user.id === parseInt(recipientId));

        if (foundUser) {
          setUser(foundUser);
        } else {
          setError("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [recipientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getAuthorUsername = () => {
    return user ? user.username : "Unknown";
  };

  const getAuthorProfilePicture = () => {
    return user ? user.profile_picture : "/default-profile.png";
  };

  return (
    <div>
      <div className="user_chatting_with">
        <img
          src={getAuthorProfilePicture()}
          alt=""
          className="author_profile_picture_component"
          id="user_chatting_profile_picture"
        />
        <h3>{getAuthorUsername()}</h3>
      </div>
      <MessageComponent recipientId={recipientId} />
    </div>
  );
}
