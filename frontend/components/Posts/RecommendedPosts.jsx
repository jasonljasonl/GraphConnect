import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from '../Accounts/SearchBar.jsx';
import '../css/RecommendedPostPage.css';
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import Like from "../Posts/LikeComponent.jsx";
import ViewPost_CommentsButton from "../Posts/ViewPost_CommentsButton.jsx";
import { useNavigate } from "react-router-dom";
import AuthorInfo from '../Accounts/AuthorInfo.jsx';
import PostComponent from "./PostComponent.jsx";


const RecommendedPosts = () => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("access_token");
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const navigate = useNavigate();
  const API_BASE_URL = 'https://graphconnect-695590394372.europe-west1.run.app/api/';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !API_BASE_URL) return;

        const response = await axios.get(`${API_BASE_URL}connected-user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(response.data);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, [token, API_BASE_URL]);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      if (!token || !API_BASE_URL) {
        setError("You must log-in and the API URL must be set.");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}recommendations/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        setRecommendedPosts(Array.isArray(response.data.recommended_posts) ? response.data.recommended_posts : []);
      } catch (err) {
        setError(err.response ? err.response.data.error : "Error");
      }
    };

    if (currentUser && API_BASE_URL) {
      fetchRecommendedPosts();
    }
  }, [token, currentUser, API_BASE_URL]);

  useEffect(() => {
    if (!API_BASE_URL) return;

    axios
      .get(`${API_BASE_URL}account/`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      if (!API_BASE_URL) return;
      const counts = {};
      for (const post of recommendedPosts) {
        try {
          const response = await axios.get(`${API_BASE_URL}posts/${post.id}/comment_count/`);
          counts[post.id] = response.data.count;
        } catch (error) {
          console.error("Failed to fetch comment count for post:", post.id, error);
        }
      }
      setCommentCounts(counts);
    };

    if (recommendedPosts.length > 0 && API_BASE_URL) {
      fetchCommentCounts();
    }
  }, [recommendedPosts, API_BASE_URL]);

  const getAuthorUsername = (authorId) => {
    const user = users.find((user) => user.id === authorId);
    return user ? user.username : "Unknown";
  };

  const getAuthorProfilePicture = (authorId) => {
    const user = users.find((user) => user.id === authorId);
    return user ? `${user.profile_picture}` : "/default-profile.png";
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token || !API_BASE_URL) {
        alert("You need to be logged in and the API URL must be set to delete a post.");
        return;
      }

      await axios.delete(`${API_BASE_URL}posts/${postId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
      alert("Something went wrong while deleting the post.");
    }
  };

  const toggleDropdown = (postId) => {
    setDropdownOpen(dropdownOpen === postId ? null : postId);
  };

  return (
       <PostComponent
      posts={recommendedPosts}
      users={users}
      currentUser={currentUser}
      commentCounts={commentCounts}
      dropdownOpen={dropdownOpen}
      toggleDropdown={toggleDropdown}
      handleDeletePost={handleDeletePost}
    />
  );
};

export default RecommendedPosts;