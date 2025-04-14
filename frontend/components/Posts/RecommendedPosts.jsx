import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from '../Accounts/SearchBar.jsx';
import '../css/RecommendedPostPage.css';
import PostsListTemplate from '../Templates/PostsListTemplate.jsx';

const RecommendedPosts = () => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");
  const API_BASE_URL = 'https://graphconnect-695590394372.europe-west1.run.app/api/';

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

        setRecommendedPosts(Array.isArray(response.data.recommended_posts) ? response.data.recommended_posts : []);
      } catch (err) {
        setError(err.response ? err.response.data.error : "Error");
      }
    };

    fetchRecommendedPosts();
  }, [token, API_BASE_URL]);

  return (
    <div>
      <SearchBar />

      {recommendedPosts.length === 0 ? (
        <p>No recommendations available.</p>
      ) : (
        <>
          <h2>For you</h2>
          <PostsListTemplate userPosts={recommendedPosts} />
        </>
      )}
    </div>
  );
};

export default RecommendedPosts;