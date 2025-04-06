import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getConnectedUser,
  getUserProfile,
  followUser,
  deletePost,
} from "../services/api";
import "../css/ProfilePage.css";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import IcBaselinePersonAddAlt from "../img_component/follow.jsx";
import Like from "../Posts/LikeComponent.jsx";
import ViewPost_CommentsButton from "../Posts/ViewPost_CommentsButton.jsx";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileResponse, currentUserResponse] = await Promise.all([
          getUserProfile(username),
          getConnectedUser(),
        ]);

        setProfile(profileResponse.data);
        setCurrentUser(currentUserResponse.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Something went wrong, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      if (!profile?.posts?.length) return;

      const counts = {};
      for (const post of profile.posts) {
        try {
          const res = await fetch(
            `https://graphconnect-695590394372.europe-west1.run.app/api/posts/${post.id}/comment_count/`
          );
          const data = await res.json();
          counts[post.id] = data.count;
        } catch (error) {
          console.error(`Error fetching comment count for post ${post.id}`, error);
        }
      }
      setCommentCounts(counts);
    };

    fetchCommentCounts();
  }, [profile]);

  const handleFollowClick = async () => {
    setFollowLoading(true);
    try {
      await followUser(username);
      const response = await getUserProfile(username);
      setProfile(response.data);
    } catch (error) {
      console.error("Error following user:", error);
      setError("Something went wrong, please try again later.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(postId);
      setProfile((prevProfile) => ({
        ...prevProfile,
        posts: prevProfile.posts.filter((post) => post.id !== postId),
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete the post.");
    }
  };

  const toggleDropdown = (postId) => {
    setDropdownOpen((prev) => (prev === postId ? null : postId));
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  const isCurrentUser = currentUser && profile && currentUser.username === profile.username;

  return (
    <div className="profile_page_container">
      <div className="profile_header">
        <img
          className="author_profile_picture_component"
          src={
            profile.profile_picture
              ? `https://storage.googleapis.com/graph-connect_bucket/media/${profile.profile_picture}`
              : "/default-profile.png"
          }
          alt="Profile"
        />
        <div className="profile_info">
          <h2>{profile.username}</h2>
          <p>{profile.bio || "No bio provided."}</p>
          <div className="profile_stats">
            <span>{profile.posts.length} posts</span>
            <span>{profile.followers.length} followers</span>
            <span>{profile.following.length} following</span>
          </div>
          {!isCurrentUser && (
            <div onClick={handleFollowClick} className="user_follow_button">
              {followLoading ? "Following..." : <IcBaselinePersonAddAlt />}
            </div>
          )}
          {isCurrentUser && (
            <div
              className="update_profile_button"
              onClick={() => navigate("/update-profile/")}
            >
              Update Profile
            </div>
          )}
        </div>
      </div>

      <div className="profile_posts">
        <h3>Posts</h3>
        {profile.posts && profile.posts.length > 0 ? (
          <ul>
            {profile.posts.map((post) => (
              <li key={post.id} className="post_list_component">
                <div className="author_component">
                  <img
                    className="author_profile_picture_component"
                    src={
                      profile.profile_picture
                        ? `https://storage.googleapis.com/graph-connect_bucket/media/${profile.profile_picture}`
                        : "/default-profile.png"
                    }
                    alt="Author"
                  />
                  <span className="author_username_component">{profile.username}</span>

                  {isCurrentUser && (
                    <div className="post-menu">
                      <button className="post-menu-button" onClick={() => toggleDropdown(post.id)}>
                        ...
                      </button>
                      {dropdownOpen === post.id && (
                        <div className="post-menu-dropdown">
                          <button onClick={() => handleDeletePost(post.id)} className="delete-post-button">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
          </ul>
        ) : (
          <p>No posts.</p>
        )}
      </div>
    </div>
  );
}
