import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentComponent = ({ postId }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}/comment_count/`);
        setCommentCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch comment count:", error);
      }
    };

    fetchCommentCount();
  }, [postId]); // Re-fetch when postId changes

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

      // ✅ Update comment count without refreshing
      setCommentCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error adding comment:", error.response?.data);
      setError("Failed to add comment. Try again.");
    }
  };

  return (
    <div>
      <p>Comments: {commentCount}</p>

      <form onSubmit={handleSubmit} className="form_comment">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post a comment..."
          required
        />
        <button type="submit">Send</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CommentComponent;
