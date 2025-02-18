import React, { useState } from "react";
import axios from "axios";

const CommentComponent = ({ postId }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You need to be logged in to comment.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image_comment", image);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/posts/${postId}/posting_comment/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Comment added:", response.data);
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error adding comment:", error.response.data);
      setError("Failed to add comment. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="..."
        required
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Post Comment</button>
      {error && <p style={{ color: "red"}}>{error}</p>}
    </form>
  );
};

export default CommentComponent;
