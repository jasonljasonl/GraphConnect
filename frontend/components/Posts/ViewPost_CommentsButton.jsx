import React from "react";
import { Link } from "react-router-dom";
import Comment from '../img_component/comment.jsx'


const ButtonToPost = ({ postId, initialComments }) => {
  const API_BASE_URL = "https://graphconnect-695590394372.europe-west1.run.app/api/";

  return (
    <Link to={`${API_BASE_URL}/posts/${postId}`}>
      <div>
        <Comment color='white' />
        <span className='comment_span'>{initialComments}</span>
      </div>
    </Link>
  );
};

export default ButtonToPost;
