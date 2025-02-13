import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PostComponent.css';
import Like from '../components/LikeComponent.jsx';

export default function Post() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/CreatePosts/')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <ul>
            <div className='post_list_div_component'>
                {posts.map(post => (
                    <li key={post.id} className='post_list_component'>
                        <p className='post_author_component'>{post.author}</p>

                        {post.image_post ? (
                            <img src={post.image_post} alt="" className="home_post_component" />
                        ) : null}

                        <p className='post_content_component'>{post.content}</p>

                        <Like postId={post.id} />
                    </li>
                ))}
            </div>
        </ul>
    );
}
