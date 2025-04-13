import React, { useState, useEffect } from "react";
import axios from "axios";
import IcSharpSend from "../img_component/send.jsx";
import IcBaselineImage from "../img_component/image_file.jsx";
import '../css/CreatePostPage.css';
import { useNavigate } from "react-router-dom";
import AuthorInfoTemplate from '../Templates/AuthorInfoTemplate.jsx';



const CreatePostComponent = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [labels, setLabels] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = "https://graphconnect-695590394372.europe-west1.run.app/api/";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}connected-user/`, {
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

  try {
    let imageUrl = null;

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

      imageUrl = imageResponse.data.file_url;
    }

    if (imageUrl) {
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
        for (const label of data.labels) {
          formData.append("labels", label);
        }
      } else {
        console.warn("Vision API error:", data.error);
      }

      formData.append("image_post", imageUrl);
    }

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

    console.log("Post created:", postResponse.data);

    setContent("");
    setImage(null);
    navigate(`/`);
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    setError("Failed to create post. Try again.");
  }
};


  const getAuthorUsername = () => {
    return user ? user.username : "Anonymous";
  };

  return (
    <div className="post_div_form">
      <form onSubmit={handleSubmit} className="form_post">
          <AuthorInfoTemplate username={getAuthorUsername()} />


        <div className="create_post_textarea_div">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}

            placeholder="Add a post..."
            required
            className="create_post_textarea"
          />
        <label htmlFor="file-input" style={{ cursor: "pointer", display: "inline-block" }}>
          <IcBaselineImage />
        </label>

        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImage(file);
              setPreviewImageUrl(URL.createObjectURL(file));
            }
          }}
        />


        </div>
        {previewImageUrl && (
                  <div style={{ marginTop: "16px" }}>
                    <img
                      src={previewImageUrl}
                      alt="Previsualization"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        borderRadius: "10px",
                        objectFit: "cover"
                      }}
                    />
                  </div>
        )}
        <button type="submit" className="send_button">
          Post
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreatePostComponent;