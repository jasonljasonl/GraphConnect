import React from "react";
import { Link } from "react-router-dom";
import Comment from '../img_component/comment.jsx'


const ButtonToPost = ({ postId, initialComments }) => {
//  const API_BASE_URL = "https://graphconnect-695590394372.europe-west1.run.app/api/";
  const API_BASE_URL = "http://localhost:8080/api/";

  return (
    <Link to={`/posts/${postId}`}>
      <div className='comment_button_div'>
        <Comment color='darkgrey' />
        <span className='comment_span'>{initialComments}</span>
      </div>
    </Link>
  );
};

export default ButtonToPost;
