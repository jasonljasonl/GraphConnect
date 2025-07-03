import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PostsListTemplate from './Templates/PostsListTemplate.jsx'

export default function Homepage() {
//    const API_BASE_URL = 'https://graphconnect-695590394372.europe-west1.run.app/api/';
    const API_BASE_URL = 'http://localhost:8080/api/';

    return (
        <PostsListTemplate fetchPostsUrl={`${API_BASE_URL}posts/followed-posts/`} />
    );
}