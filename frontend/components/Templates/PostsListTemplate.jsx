import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/PostComponent.css";
import Like from "../Posts/LikeComponent.jsx";
import ViewPost_CommentsButton from "../Posts/ViewPost_CommentsButton.jsx";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import AuthorInfoTemplate from './AuthorInfoTemplate.jsx';

export default function PostsListTemplate({ userPosts, fetchPostsUrl, isProfilePage = false }) {
  const [posts, setPosts] = useState(userPosts || []);
  const [users, setUsers] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  // const API_BASE_URL = "https://graphconnect-695590394372.europe-west1.run.app/api/";
  const API_BASE_URL = "http://localhost:8080/api";
  const LINK_BASE_URL = "http://localhost:8080";
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken || !API_BASE_URL) {
          console.error("No access token found or API base URL not set");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/connected-user/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (userPosts) return;

    const token = localStorage.getItem('access_token');

    if (!token || !API_BASE_URL) {
      console.error('No token found or API base URL not set. Please login.');
      return;
    }

    axios
      .get(fetchPostsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch posts:', error);
      });
  }, [fetchPostsUrl, userPosts, API_BASE_URL]);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const post of posts) {
        try {
          const response = await axios.get(`${API_BASE_URL}/posts/${post.id}/comment_count/`);
          counts[post.id] = response.data.count;
        } catch (error) {
          console.error("Failed to fetch comment count for post:", post.id, error);
        }
      }
      setCommentCounts(counts);
    };

    if (posts.length > 0 && API_BASE_URL) {
      fetchCommentCounts();
    }
  }, [posts, API_BASE_URL]);

    useEffect(() => {
        if (!API_BASE_URL) return;
        axios.get(`${API_BASE_URL}/account/`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [API_BASE_URL]);

  const getAuthorUsername = (authorId) => {
    const user = users.find((user) => user.id === authorId);
    return user ? user.username : "Unknown";
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token || !API_BASE_URL) {
        alert("You need to be logged in and the API URL to delete a post.");
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
    <div className="post_list_div_component">
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post_list_component">
              <div className="author_component" style={{ cursor: "pointer" }}>
                <AuthorInfoTemplate username={getAuthorUsername(post.author)} />

                {currentUser && currentUser.id === post.author && (
                  <div className="post-menu">
                    <button className="post-menu-button" onClick={() => toggleDropdown(post.id)}>...</button>
                    {dropdownOpen === post.id && (
                      <div className="post-menu-dropdown">
                        <button onClick={() => handleDeletePost(post.id)} className="delete-post-button">Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
                {post.image_post && (
                  <img
                    src={
                      isProfilePage
                        ? `${LINK_BASE_URL}/uploaded_images/${post.image_post}`
                        : `${post.image_post}`
                    }
                    alt="Post"
                    className="home_post_component"
                  />
                )}

              <p className="post_content_component">{post.content}</p>
              <p className="post_upload_date">
                {formatDistanceToNow(new Date(post.upload_date), { locale: enUS })} ago
              </p>
              <div className="post_interactions">
                <Like postId={post.id} initialLikes={Array.isArray(post.likes) ? post.likes.length : 0} />
                <ViewPost_CommentsButton postId={post.id} initialComments={commentCounts[post.id] || 0} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}