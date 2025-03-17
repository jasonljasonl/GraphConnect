import React from "react";
import { Link } from "react-router-dom";
import Comment from '../components/img_component/comment.jsx'


const ButtonToPost = ({ postId, initialComments }) => {
  return (
    <Link to={`/posts/${postId}`}>
      <div>
        <Comment color='white' />
        <span className='comment_span'>{initialComments}</span>
      </div>
    </Link>
  );
};

export default ButtonToPost;
