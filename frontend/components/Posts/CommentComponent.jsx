import React, { useState, useEffect } from "react";
import { getCommentCount, getConnectedUser, postComment } from "../services/api";
import IcSharpSend from "../img_component/send.jsx";
import IcBaselineImage from "../img_component/image_file.jsx";

const CommentComponent = ({ postId }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [user, setUser] = useState(null);
  const API_BASE_URL = "https://graphconnect-695590394372.europe-west1.run.app/api/";

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await getCommentCount(postId);
        setCommentCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch comment count:", error);
      }
    };

    fetchCommentCount();
  }, [postId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getConnectedUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image_comment", image);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You need to be logged in to comment.");
        return;
      }

      const response = await postComment(postId, formData);
      console.log("Comment added:", response.data);
      setContent("");
      setImage(null);
      setCommentCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Try again.");
    }
  };

  return (
    <div className="comment_div_form">
      <form onSubmit={handleSubmit} className="form_comment">
        {user && user.profile_picture ? (
          <img
            src={`${API_BASE_URL}${user.profile_picture}`}
            alt="Profil"
            width="50"
            className="comment_author_profile_picture_component"
          />
        ) : (
          <p>No profile picture</p>
        )}

        <div className="textarea_div">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            required
            className="comment_textarea"
          />
          <label htmlFor="file-input" className="comment_form_input_img">
            <IcBaselineImage />
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="comment_form_input_img"
            id="file-input"
          />
        </div>
        <button type="submit" className="send_button">
          <IcSharpSend />
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CommentComponent;
