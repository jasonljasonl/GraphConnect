import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PostComponent.css';
import './css/CommentsPage.css';


export default function CommentsList({ postId }) {  // Accept postId as a prop
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/commentsList/')
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/account/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error(error);
            });
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
        <ul>
            <div className='comments_list_div_component'>
                {comments
                    .filter(comment => comment.related_post === postId)
                    .map(comment => (
                        <li key={comment.id} className='comments_list_component'>
                            <div className='comment_content_div'>
                                <div className='author_component'>
                                    <img src={getAuthorProfilePicture(comment.author)} alt="" className="author_profile_picture_component" />
                                    <p className='post_author_component'>{getAuthorUsername(comment.author)}</p>
                                </div>
                                <p className='post_content_component'>{comment.content}</p>

                                {comment.image_comment && (
                                    <img src={comment.image_comment} alt="" className="comment_page_post_component" />
                                )}
                            </div>
                        </li>
                    ))}
            </div>
        </ul>
    );
}
