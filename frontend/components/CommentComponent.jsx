import React, { useState, useEffect } from "react";
import axios from "axios";
import IcSharpSend from "./img_component/send.jsx";
import IcBaselineImage from "./img_component/image_file.jsx";


const CommentComponent = ({ postId }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [user, setUser] = useState(null);

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
  }, [postId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get("http://127.0.0.1:8000/api/connected-user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUser();
  }, []);

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
      setCommentCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error adding comment:", error.response?.data);
      setError("Failed to add comment. Try again.");
    }
  };

  return (
    <div className='comment_div_form'>



      <form onSubmit={handleSubmit} className="form_comment">

        {user && user.profile_picture ? (
          <img src={`http://127.0.0.1:8000${user.profile_picture}`} alt="Profil" width="50" className='comment_author_profile_picture_component' />
        ) : (
          <p>Aucune photo de profil</p>
        )}

      <div className='textarea_div'>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="  Add a comment..."
          required
          className='comment_textarea'

        />
        <label htmlFor='file-input' className='comment_form_input_img'><IcBaselineImage/></label>
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className='comment_form_input_img'
                id='file-input'
            />
      </div>
        <button type="submit" className='send_button'>
          <IcSharpSend />
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CommentComponent;
