import axios from 'axios';
import heart from "./img_component/heart.svg";
import React, { useState } from 'react';

const LikeComponent = ({ postId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLikeClick = async () => {
        setLoading(true);
        setError(null);  // Reset any previous errors

        try {
            // Get the JWT token from localStorage (or sessionStorage)
            const token = localStorage.getItem('access_token');
            console.log("JWT Token:", token);
            if (!token) {
                setError('You need to be logged in.');
                setLoading(false);
                return;
            }

            // Make the GET request to like the post
            const response = await axios.post(
                `http://127.0.0.1:8000/Home/${postId}/like/`,
                {}, // Empty body since it's just liking the post
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            // If the like is successful, update the state
            if (response.data.message === 'Post liked successfully') {
                setIsLiked(true);
                console.log('Post liked:', response.data);
            }
        } catch (error) {
            // Handle any errors (e.g., unauthorized, 404)
            console.error("Error liking the post:", error);
            setError('Something went wrong, please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleLikeClick} disabled={loading}>
                {loading ? 'Liking...' : isLiked ? 'Liked' : 'Like'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LikeComponent;