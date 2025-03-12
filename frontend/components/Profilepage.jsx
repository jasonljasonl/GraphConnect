import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/ProfilePage.css';
import Like from '../components/LikeComponent.jsx';
import ViewPost_CommentsButton from '../components/ViewPost_CommentsButton.jsx';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import IcBaselinePersonAddAlt from './img_component/follow.jsx'
import IcRoundMailOutline from './img_component/message.jsx'
import { useNavigate } from "react-router-dom";


const ProfilePage = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentCounts, setCommentCounts] = useState({});

    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/profile/${username}/`);
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement du profil:', error);
            }
        };
        fetchProfile();
    }, [username]);

    useEffect(() => {
        const fetchCommentCounts = async () => {
            if (!profile || !profile.posts) return;
            const counts = {};
            for (const post of profile.posts) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/posts/${post.id}/comment_count/`);
                    counts[post.id] = response.data.count;
                } catch (error) {
                    console.error("Failed to fetch comment count for post:", post.id, error);
                }
            }
            setCommentCounts(counts);
        };
        fetchCommentCounts();
    }, [profile]);

    if (loading) {
        return <div>Chargement...</div>;
    }



    const handleFollowClick = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('You need to be logged in.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/account/${username}/follow/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );


        } catch (error) {
            console.error("Error:", error);
            setError('Something went wrong, please try again later.');
        } finally {
            setLoading(false);
        }
    };





    return (
        <div className="profile-container">
            <div className='user_informations'>
                {profile.profile_picture && (
                    <img src={`http://127.0.0.1:8000${profile.profile_picture}`} alt="Photo de profil" className="profile-picture" />
                    )}
                <div>

                    <p>{profile.username}</p>

                    <div className='followers-number'>
                        <p className="follows_component">{profile.following.length} Followers</p>
                        <p className="follows_component">{profile.followers.length} Following</p>
                    </div>

                    <div className='user_interactions_buttons'>
                        <div onClick={handleFollowClick} className='user_follow_button'>
                              <IcBaselinePersonAddAlt />
                        </div>
                        <div onClick={() => navigate(`/messages/${profile.id}`)} className='user_send_message_button'>

                             <IcRoundMailOutline />
                        </div>
                    </div>

                </div>

            </div>

            <div className="post_list_div_component">
                {profile.posts.length > 0 ? (
                    profile.posts.map(post => (
                        <div key={post.id} className="post_list_component profile_post_list_component" >
                            <div className="author_component">
                                <img
                                    src={`http://127.0.0.1:8000${profile.profile_picture}`}
                                    alt=""
                                    className="author_profile_picture_component"
                                />
                                <p className="post_author_component">{profile.username}</p>

                            </div>

                            {post.image_post && (
                                <img src={`http://127.0.0.1:8000/uploaded_images/${post.image_post}`} alt="Post" className="home_post_component" />
                            )}
                            <p className="post_content_component">{post.content}</p>

                            <p className="post_upload_date">
                                {formatDistanceToNow(new Date(post.upload_date), { locale: enUS })} ago
                            </p>


                        </div>
                    ))
                ) : (
                    <p>No post.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;