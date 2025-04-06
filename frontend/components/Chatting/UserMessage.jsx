import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageComponent from "./MessageComponent";
import { getUsers } from "../services/api";
import AuthorInfo from '../Accounts/AuthorInfo.jsx';

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

  return (
    <div>
      <div className="user_chatting_with">
        <AuthorInfo username={user.username} profilePicture={user.profile_picture} />
      </div>
      <MessageComponent recipientId={recipientId} />
    </div>
  );
}
