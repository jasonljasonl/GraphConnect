import axios from 'axios';
import HealthiconsHeart from "../img_component/heart.jsx";
import React, { useState, useEffect } from 'react';

const LikeComponent = ({ postId, initialLikes }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token || !postId || !API_BASE_URL) return;

        fetch(`${API_BASE_URL}check-like/${postId}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsLiked(data.liked);
            })
            .catch((err) => console.error("Error:", err));
    }, [postId, API_BASE_URL]);

    const handleLikeClick = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('access_token');
        if (!token || !API_BASE_URL) {
            setError('You need to be logged in.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}Home/${postId}/like/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                const newLikeState = !isLiked;
                setIsLiked(newLikeState);
                setLikeCount((prevCount) => newLikeState ? prevCount + 1 : prevCount - 1);
            }

        } catch (error) {
            console.error("Error liking the post:", error);
            setError('Something went wrong, please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='like_div'>
            <div onClick={handleLikeClick} disabled={loading}>
                {isLiked ? <HealthiconsHeart color='red' /> : <HealthiconsHeart color='white' />}
            </div>
            <p>{likeCount}</p>
        </div>
    );
};

export default LikeComponent;