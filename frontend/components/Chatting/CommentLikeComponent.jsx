import axios from 'axios';
import HealthiconsHeart from "./img_component/heart.jsx";
import React, { useState, useEffect } from 'react';

const CommentLikeComponent = ({ commentId, initialLikes }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token || !commentId) return;

        fetch(`http://localhost:8000/api/check-comment_like/${commentId}/`, {
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
    }, [commentId]);


    const handleLikeClick = async () => {
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
                `http://127.0.0.1:8000/Home/${commentId}/comment_like/`,
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
            console.error("Error liking the comment:", error);
            setError('Something went wrong, please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='comment_like_div'>
            <div onClick={handleLikeClick} disabled={loading}>
                {isLiked ? <HealthiconsHeart color='red' /> : <HealthiconsHeart color='white' />}
            </div>
            <p>{likeCount}</p>
        </div>
    );
};

export default CommentLikeComponent;
