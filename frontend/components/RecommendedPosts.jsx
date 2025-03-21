import React, { useState, useEffect } from "react";
import axios from "axios";

const RecommendedPosts = () => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

        setRecommendedPosts(response.data.recommended_posts);
        console.log(response.data.recommended_posts)
      } catch (err) {
        setError(err.response ? err.response.data.error : "Erreur inconnue");
      }
    };

    if (user) {
      fetchRecommendedPosts();
    }
  }, [token, user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Posts Recommandés</h2>
      <div className="post-list">
        {recommendedPosts.length === 0 ? (
          <p>Aucun post recommandé pour le moment.</p>
        ) : (
          recommendedPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>Labels: {post.labels.join(", ")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedPosts;
