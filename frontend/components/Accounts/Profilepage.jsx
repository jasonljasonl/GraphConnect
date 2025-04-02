import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConnectedUser, getUserProfile, followUser, deletePost } from "../services/api";
import "../css/ProfilePage.css";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import IcBaselinePersonAddAlt from "../img_component/follow.jsx";
import IcRoundMailOutline from "../img_component/message.jsx";

const ProfilePage = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getConnectedUser();
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile(username);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const handleFollowClick = async () => {
        setLoading(true);
        setError(null);

        try {
            await followUser(username);
        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong, please try again later.");
        } finally {
            setLoading(false);
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
            alert("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error.response?.data || error.message);
            alert("Something went wrong while deleting the post.");
        }
    };

    const toggleDropdown = (postId) => {
        setDropdownOpen(dropdownOpen === postId ? null : postId);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="user_informations">
                {profile.profile_picture && (
                    <img src={profile.profile_picture} alt="Profile" className="profile-picture" />
                )}
                <div>
                    <p>{profile.username}</p>
                    <div className="followers-number">
                        <p className="follows_component">{profile.following.length} Followers</p>
                        <p className="follows_component">{profile.followers.length} Following</p>
                    </div>

                    {user && user.username !== profile.username && (
                        <div className="user_interactions_buttons">
                            <div onClick={handleFollowClick} className="user_follow_button">
                                <IcBaselinePersonAddAlt />
                            </div>
                            <div onClick={() => navigate(`/messages/${profile.id}`)} className="user_send_message_button">
                                <IcRoundMailOutline />
                            </div>
                        </div>
                    )}

                    {user && user.username === profile.username && (
                        <div onClick={() => navigate(`/account/update`)} className="update_profile_button">
                            <p>Update Profile</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="post_list_div_component">
                {profile.posts.length > 0 ? (
                    profile.posts.map((post) => (
                        <div key={post.id} className="post_list_component profile_post_list_component">
                            <div className="author_component">
                                <img
                                    src={profile.profile_picture}
                                    alt="Author"
                                    className="author_profile_picture_component"
                                />
                                <p className="post_author_component">{profile.username}</p>

                                {user && user.username === profile.username && (
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
                        </div>
                    ))
                ) : (
                    <p>No posts.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
