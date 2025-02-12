import React, { useState, useEffect } from 'react';
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
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
      {posts.map(post => (
        <li key={post.id}>
            <img src={post.image_post} alt="" />
            {post.content}
        </li>
      ))}
    </ul>
    );
}

export default App
