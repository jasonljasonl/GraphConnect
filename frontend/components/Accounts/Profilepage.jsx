import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConnectedUser, getUserProfile, followUser, deletePost } from "../services/api";
import "../css/ProfilePage.css";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import IcBaselinePersonAddAlt from "../img_component/follow.jsx";
import IcRoundMailOutline from "../img_component/message.jsx";
import Like from "../Posts/LikeComponent.jsx";
import ViewPost_CommentsButton from "../Posts/ViewPost_CommentsButton.jsx";
import PostComponent from "../Posts/PostComponent.jsx";


const ProfilePage = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const navigate = useNavigate();
    const [commentCounts, setCommentCounts] = useState({});
    const [currentUser, setCurrentUser] = useState(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getConnectedUser();
                setUser(response.data);
                setCurrentUser(response.data);
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

useEffect(() => {
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.get("https://graphconnect-695590394372.europe-west1.run.app/api/account/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    fetchUsers();
}, []);

    return (
        <div className="profile-container">
            <div className="user_informations">

                <div >
                    <div className='author_component'>
                        <img className='author_profile_picture_component' src= {profile.profile_picture} />
                        <div className='name_and_followers'>
                            <p>{profile.username}</p>
                            <div className="followers-number">
                                <p className="follows_component">{profile.following.length} Followers</p>
                                <p className="follows_component">{profile.followers.length} Following</p>
                            </div>
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
            </div>

               <PostComponent
                  posts={profile.posts}
                  users={users}
                  currentUser={currentUser}
                  commentCounts={commentCounts}
                  dropdownOpen={dropdownOpen}
                  toggleDropdown={toggleDropdown}
                  handleDeletePost={handleDeletePost}
               />
        </div>
    );
};

export default ProfilePage;
