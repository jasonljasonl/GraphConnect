import React, { useState, useEffect } from 'react';
import { getCommentsList, getUsers } from '../services/api'; // Importation des fonctions API
import '../css/PostComponent.css';
import '../css/CommentsPage.css';
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function CommentsList({ postId }) {
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Récupérer les commentaires
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getCommentsList();
                setComments(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchComments();
    }, []);

    // Récupérer les utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    const getAuthorUsername = (authorId) => {
        const user = users.find(user => user.id === authorId);
        return user ? user.username : 'Unknown';
    };

    const getAuthorProfilePicture = (authorId) => {
        const user = users.find(user => user.id === authorId);
        return user ? user.profile_picture : 'Unknown';
    };

    return (
        <ul className='comments_list_ul'>
            <div className='comments_list_div_component'>
                {comments
                    .filter(comment => comment.related_post === postId)
                    .map(comment => (
                        <li key={comment.id} className='comments_list_component'>
                            <div className='comment_content_div'>
                                <div className='author_component'>
                                    <img
                                        src={getAuthorProfilePicture(comment.author)}
                                        alt=""
                                        className="author_profile_picture_component"
                                    />
                                    <p
                                        onClick={() => navigate(`/profile/${getAuthorUsername(comment.author)}`)}
                                        className='post_author_component'
                                    >
                                        {getAuthorUsername(comment.author)}
                                    </p>
                                    <p className='comment_upload_date'>
                                        - {formatDistanceToNow(new Date(comment.upload_date), { locale: enUS })} ago
                                    </p>
                                </div>
                                <div className='content-like_div'>
                                    <p className='post_content_component'>{comment.content}</p>
                                </div>
                                {comment.image_comment && (
                                    <img
                                        src={comment.image_comment}
                                        alt=""
                                        className="comment_page_post_component"
                                    />
                                )}
                            </div>
                        </li>
                    ))}
            </div>
        </ul>
    );
}
