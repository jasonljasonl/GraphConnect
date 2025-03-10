import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/PostComponent.css";
import Like from "../components/LikeComponent.jsx";
import ViewPost_CommentsButton from "../components/ViewPost_CommentsButton.jsx";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [following, setFollowing] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/connected-user/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setCurrentUser(response.data);
        setFollowing(new Set(response.data.following || []));
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No token found. Please login.');
      return;
    }

    axios
      .get('http://127.0.0.1:8000/api/posts/followed-posts/', {
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
  }, []);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const post of posts) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/posts/${post.id}/comment_count/`);
          counts[post.id] = response.data.count;
        } catch (error) {
          console.error("Failed to fetch comment count for post:", post.id, error);
        }
      }
      setCommentCounts(counts);
    };

    if (posts.length > 0) {
      fetchCommentCounts();
    }
  }, [posts]);

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

  return (
    <ul>
      <div className="post_list_div_component">
        <ul>
          <div className="post_list_div_component">
            {posts.map((post) => (
              <li key={post.id} className="post_list_component">
                <div className="author_component">
                  <img
                    src={getAuthorProfilePicture(post.author)}
                    alt=""
                    className="author_profile_picture_component"
                  />
                  <p className="post_author_component">{getAuthorUsername(post.author)}</p>
                </div>

                {post.image_post && (
                  <img src={post.image_post} alt="Post" className="home_post_component" />
                )}

                <p className="post_content_component">{post.content}</p>
                <p className="post_upload_date">
                  {formatDistanceToNow(new Date(post.upload_date), { locale: enUS })} ago
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
        </ul>
      </div>
    </ul>
  );
}
