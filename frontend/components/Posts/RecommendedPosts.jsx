import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from '../Accounts/SearchBar.jsx'
import '../css/RecommendedPostPage.css';
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import Like from "../Posts/LikeComponent.jsx";
import ViewPost_CommentsButton from "../Posts/ViewPost_CommentsButton.jsx";
import { useNavigate } from "react-router-dom";

const RecommendedPosts = () => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("access_token");
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) return;

        const response = await axios.get("http://127.0.0.1:8000/api/connected-user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurrentUser(response.data);

      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      if (!token) {
        setError("Vous devez être connecté pour voir les recommandations.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/recommendations/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        setRecommendedPosts(Array.isArray(response.data.recommended_posts) ? response.data.recommended_posts : []);
      } catch (err) {
        setError(err.response ? err.response.data.error : "Erreur inconnue");
      }
    };

    if (currentUser) {
      fetchRecommendedPosts();
    }
  }, [token, currentUser]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/account/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, []);

  const getAuthorUsername = (authorId) => {
    const user = users.find((user) => user.id === authorId);
    return user ? user.username : "Unknown";
  };

  const getAuthorProfilePicture = (authorId) => {
    const user = users.find((user) => user.id === authorId);
    return user ? user.profile_picture : "/default-profile.png";
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to be logged in to delete a post.");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/delete/`, {
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
    <div>
      {/* Afficher la barre de recherche tout le temps */}
      <SearchBar />

      {/* Afficher le message si aucun post n'est disponible */}
      {recommendedPosts.length === 0 ? (
        <p>No recommendations available.</p>
      ) : (
        <>
          <h2>For you</h2>
          <div className="post_list_div_component">
            {recommendedPosts.map((post) => (
              <li key={post.id} className="post_list_component">
                <div className="author_component">
                  <img
                    src={getAuthorProfilePicture(post.author)}
                    alt=""
                    className="author_profile_picture_component"
                  />
                  <p
                    onClick={() =>
                      navigate(`/profile/${getAuthorUsername(post.author)}`)
                    }
                    className="post_author_component"
                  >
                    {getAuthorUsername(post.author)}
                  </p>

                  {currentUser && currentUser.id === post.author && (
                    <div className="post-menu">
                      <button
                        className="post-menu-button"
                        onClick={() => toggleDropdown(post.id)}
                      >
                        ...
                      </button>
                      {dropdownOpen === post.id && (
                        <div className="post-menu-dropdown">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="delete-post-button"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <img
                  src={`http://127.0.0.1:8000${post.image_post}`}
                  alt="image"
                  className="home_post_component"
                />
                <p className="post_content_component">{post.content}</p>
                <p className="post_upload_date">
                  {formatDistanceToNow(new Date(post.upload_date), {
                    locale: enUS,
                  })}{" "}
                  ago
                </p>
                <div className="post_interactions">
                  <Like postId={post.id} initialLikes={post.likes.length} />
                  <ViewPost_CommentsButton
                    postId={post.id}
                    initialComments={commentCounts[post.id] || 0}
                  />
                </div>
              </li>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendedPosts;
