import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import CommentComponent from './CommentComponent.jsx';
import CommentsPage from './CommentsPage.jsx';
import Like from './LikeComponent.jsx';
import Comment from '../img_component/comment.jsx';
import ViewPost_CommentsButton from './ViewPost_CommentsButton.jsx';
import '../css/PostComponent.css';
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";


const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

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


  if (error) return <p>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div className='view_post_post_content'>
        <div className='author_component'>
            <img src={getAuthorProfilePicture(post.author)} alt="" className="author_profile_picture_component" />
            <p className='post_author_component'>{getAuthorUsername(post.author)}</p>
        </div>

{post.image_post && <img src={post.image_post} alt='' width='100%' />}
      <p className='view_post_post_description'>{post.content}</p>
      <p className='post_upload_date'>{formatDistanceToNow(new Date(post.upload_date), { locale: enUS })} ago</p>

            <div className='post_interactions'>
              <Like postId={post.id} initialLikes={post.likes.length} />
              <ViewPost_CommentsButton postId={post.id}
              />
            </div>
      <CommentComponent postId={post.id} />
      <CommentsPage postId={parseInt(postId)}/>

    </div>

  );
};

export default PostDetail;
