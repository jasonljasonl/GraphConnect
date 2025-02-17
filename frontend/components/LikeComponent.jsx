import axios from 'axios';
import HealthiconsHeart from "./img_component/heart.jsx";
import React, { useState, useEffect } from 'react';

const LikeComponent = ({ postId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return;
            }

        if (!postId) return;

        fetch(`http://localhost:8000/api/check-like/${postId}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setIsLiked(data.liked))
            .catch((err) => console.error("Error:", err));
    }, [postId]);

    const handleLikeClick = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('You need to be logged in.');
                setLoading(false);
                return;
            }

            // Toggle the like status locally before making the API call
            setIsLiked((prevIsLiked) => !prevIsLiked);

            const response = await axios.post(
                `http://127.0.0.1:8000/Home/${postId}/like/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );


        } catch (error) {

            setIsLiked((prevIsLiked) => !prevIsLiked);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={handleLikeClick} disabled={loading} style={{ cursor: 'pointer' }}>
            {isLiked ? <HealthiconsHeart color='red' /> : <HealthiconsHeart color='white' />}
        </div>
    );
};

export default LikeComponent;
