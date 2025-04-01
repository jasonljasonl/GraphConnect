import React, { useState, useEffect } from "react";
import axios from "axios";
import IcSharpSend from "../img_component/send.jsx";
import IcBaselineImage from "../img_component/image_file.jsx";
import '../css/CreatePostPage.css';
import { useNavigate } from "react-router-dom";

const CreatePostComponent = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [labels, setLabels] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${API_BASE_URL}account/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You need to be logged in to post.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("author", user.id);
    if (image) formData.append("image_post", image);

    try {
      let imageUrl = null;
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      if (image) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);

        const imageResponse = await axios.post(
          `${API_BASE_URL}storage_uploads/`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Image uploaded:", imageResponse.data);
        imageUrl = imageResponse.data.file_url;
        console.log(imageUrl);
      }

      const visionResponse = await fetch(`${API_BASE_URL}image_vision/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_url: imageUrl }),
      });

      const data = await visionResponse.json();

      if (visionResponse.ok) {
        setLabels(data.labels);
          console.log("Detected Labels:", data.labels);
        setError('');
      } else {
        setError(data.error || 'Something went wrong');
      }


    for (const label of data.labels)  {
         formData.append('labels', label)
        }



      if (imageUrl) formData.append("image_post", imageUrl);

      const postResponse = await axios.post(
        `${API_BASE_URL}posts/create_post/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Post added:", postResponse.data);

      setContent("");
      setImage(null);
      navigate(`/`);
    } catch (error) {
      console.error("Error creating post:", error.response?.data);
      setError("Failed to create post. Try again.");
    }
  };

  return (
    <div className="post_div_form">
      <form onSubmit={handleSubmit} className="form_post">
        {user && user.profile_picture ? (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${user.profile_picture}`}
            alt="Profil"
            width="50"
            className="post_author_profile_picture_component"
          />
        ) : (
          <p>Aucune photo de profil</p>
        )}

        <div className="create_post_textarea_div">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a post..."
            required
            className="create_post_textarea"
          />
          <label htmlFor="file-input" className="post_form_input_img">
            <IcBaselineImage />
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="create_post_form_input_img"
            id="file-input"
          />
        </div>
        <button type="submit" className="send_button">
          Post
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreatePostComponent;