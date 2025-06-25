import React, { useState, useEffect } from "react";
import { checkCommentLike, toggleCommentLike } from "../services/api";
import HealthiconsHeart from "../img_component/heart.jsx";

const CommentLikeComponent = ({ commentId, initialLikes }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await checkCommentLike(commentId);
                setIsLiked(response.data.liked);
            } catch (err) {
                console.error("Error fetching like status:", err);
            }
        };

        if (commentId) {
            fetchLikeStatus();
        }
    }, [commentId]);

    const handleLikeClick = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await toggleCommentLike(commentId);
            if (response.status === 200 || response.status === 201) {
                const newLikeState = !isLiked;
                setIsLiked(newLikeState);
                setLikeCount((prevCount) => (newLikeState ? prevCount + 1 : prevCount - 1));
            }
        } catch (err) {
            console.error("Error toggling like:", err);
            setError("Something went wrong, please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comment_like_div">
            <div onClick={handleLikeClick} disabled={loading}>
                {isLiked ? <HealthiconsHeart color="red" /> : <HealthiconsHeart color="darkgrey" />}
            </div>
            <p>{likeCount}</p>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CommentLikeComponent;
