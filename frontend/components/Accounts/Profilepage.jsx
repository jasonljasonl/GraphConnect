import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConnectedUser, getUserProfile, followUser, deletePost } from "../services/api";
import "../css/ProfilePage.css";
import IcBaselinePersonAddAlt from "../img_component/follow.jsx";
import IcRoundMailOutline from "../img_component/message.jsx";
import PostsListTemplate from '../Templates/PostsListTemplate.jsx';
import AuthorInfoTemplate from '../Templates/AuthorInfoTemplate.jsx';

const ProfilePage = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>User profile not found.</div>;
    }

    return (
        <div className="profile-container">
            <div className="user_informations">
                <div>
                    <AuthorInfoTemplate username={profile.username} profilePicture={profile.profile_picture}/>
                    <div className="followers-number">
                        <p className="follows_component">{profile.followers.length} Followers</p>
                        <p className="follows_component">{profile.following.length} Following</p>
                    </div>
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

            <PostsListTemplate userPosts={profile.posts} />
        </div>
    );
};

export default ProfilePage;