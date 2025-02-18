import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PostComponent.css';
import Like from '../components/LikeComponent.jsx';
import CommentComponent from '../components/CommentComponent.jsx';
import Comment from '../components/img_component/comment.jsx'
import CommentsPage from '../components/CommentsPage.jsx'
import ViewPostPage from '../components/ViewPostPage.jsx'
import ButtonToPost from '../components/ButtonToPost.jsx'

export default function Post() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/postsList/')
            .then(response => {
                setPosts(response.data);
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
            <div className='post_list_div_component'>
                {posts.map(post => (
                    <li key={post.id} className='post_list_component'>

                        <div className='author_component'>
                            <img src={getAuthorProfilePicture(post.author)} alt="" className="author_profile_picture_component" />
                            <p className='post_author_component'>{getAuthorUsername(post.author)}</p>
                        </div>

                        {post.image_post && (
                            <img src={post.image_post} alt="Post" className="home_post_component" />
                        )}

                        <p className='post_content_component'>{post.content}</p>
                        <div className='post_interactions'>
                            <Like postId={post.id} />
                            <ButtonToPost postId={post.id} />


                        </div>
                    </li>
                ))}
            </div>
        </ul>
    );
}
