import React from "react";
import { Link } from "react-router-dom";
import Comment from '../components/img_component/comment.jsx'

const ButtonToPost = ({ postId }) => {
  return (
    <Link to={`/posts/${postId}`}>
      <Comment color='white' />
    </Link>
  );
};

export default ButtonToPost;
