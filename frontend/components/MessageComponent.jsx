import React, { useState, useEffect } from "react";
import axios from "axios";
import IcSharpSend from "./img_component/send.jsx";

const MessageComponent = ({ recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
const fetchMessages = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `http://127.0.0.1:8000/api/chat/messages/${recipientId}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Messages fetched:", response.data);  // Ajoutez un log pour vérifier la réponse
    setMessages(response.data);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};


    fetchMessages();
  }, [recipientId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/connected-user/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }, []);

  const sendMessage = async () => {
    const senderId = currentUser?.id;

    if (!senderId) {
      console.error("Sender ID not found");
      return;
    }

    const token = localStorage.getItem("access_token");

    const messageData = {
      recipient_id: recipientId,
      content: content,
      sender_id: senderId,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat/messages/",
        messageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");

      setMessages([...messages, response.data]);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/account/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, []);

  const getAuthorUsername = (message_sender) => {
    const user = users.find((user) => user.id === message_sender);
    return user ? user.username : "Unknown";
  };

  const getAuthorProfilePicture = (message_sender) => {
    const user = users.find((user) => user.id === message_sender);
    return user ? user.profile_picture : "/default-profile.png";
  };

  return (

    <div className="chat-box">
      <div className="chat-messages">
            {messages.map((msg) => {
              const isCurrentUser = msg.message_sender === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={isCurrentUser ? "current_user_private_message_div" : "user_private_message_div"}
                >
                  {isCurrentUser ? (
                    <>
                      <p className="user_private_message_content">{msg.content}</p>
                    </>
                  ) : (
                    <>
                      <p className="user_private_message_content">{msg.content}</p>
                    </>
                  )}
                </div>
              );
            })}
      </div>
      <div className='textarea_button_div'>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a message..."
            className='send_message_textarea'
          />
          <button onClick={sendMessage} className='send_button'>Send</button>
      </div>
    </div>
  );
};

export default MessageComponent;
