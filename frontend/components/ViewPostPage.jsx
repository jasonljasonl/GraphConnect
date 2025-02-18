import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation
import CommentComponent from '../components/CommentComponent.jsx';
import CommentsPage from '../components/CommentsPage.jsx';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}/`);
        setPost(response.data);
      } catch (err) {
        setError("Failed to load post");
      }
    };

    fetchPost();
  }, [postId]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <img src={post.image_post} alt='' width='100%' />
      <p>{post.content}</p>
      <CommentComponent postId={post.id} />
      <CommentsPage postId={parseInt(postId)}/>

    </div>

  );
};

export default PostDetail;
