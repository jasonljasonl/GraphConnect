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
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8080/api/";
  const LINK_BASE_URL = "http://localhost:8080";

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

    if (image) {
      formData.append("image_post", image);
    }

    try {
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
      <form onSubmit={handleSubmit} className="form_post" encType="multipart/form-data">
        <AuthorInfoTemplate username={getAuthorUsername()} />

        <div className="create_post_textarea_div">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a post..."
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />

          <label htmlFor="file-input" style={{ cursor: "pointer", display: "inline-block" }}>
              <svg class="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
              </svg>
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

        <button type="submit" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
          Post
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreatePostComponent;
