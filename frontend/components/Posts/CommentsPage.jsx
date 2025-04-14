import React, { useState, useEffect } from 'react';
import { getCommentsList, getUsers } from '../services/api';
import '../css/PostComponent.css';
import '../css/CommentsPage.css';
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import AuthorInfoTemplate from '../Templates/AuthorInfoTemplate.jsx';



export default function CommentsList({ postId }) {
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

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

    return (
        <ul className='comments_list_ul'>
            {comments
                .filter(comment => comment.related_post === postId)
                .map(comment => (
                    <li key={comment.id} className='comments_list_component'>
                        <div className='comment_content_div'>
                            <AuthorInfoTemplate username={getAuthorUsername(comment.author)} />

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
                            <p className="post_upload_date">
                              {formatDistanceToNow(new Date(post.upload_date), { locale: enUS })}{" "}
                              ago
                            </p>
                        </div>
                    </li>
                ))
            }
        </ul>
    );
}
