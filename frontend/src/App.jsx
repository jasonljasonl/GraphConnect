import React from 'react';
import './App.css';
import Post from '../components/Posts/PostComponent.jsx';
import GetUsers from '../components/Accounts/GetUsersComponent.jsx';
import { NavBar } from '../components/NavBar.jsx';
import { Login } from "../components/Login/Login";
import { Logout } from "../components/Login/Logout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../components/Axios';
import ViewPostPage from '../components/Posts/ViewPostPage.jsx';
import CreatePostComponent from '../components/Posts/CreatePostComponent.jsx';
import MessagePage from '../components/Chatting/MessagePage.jsx';
import UserMessage from '../components/Chatting/UserMessage.jsx';
import SearchBar from '../components/Accounts/SearchBar.jsx'
import ProfilePage from '../components/Accounts/ProfilePage.jsx'
import UserProfileUpdate from '../components/Accounts/UserProfileUpdate.jsx'
import RecommendedPosts from '../components/Posts/RecommendedPosts.jsx'


function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Post />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/posts/:postId" element={<ViewPostPage />} />
                <Route path="/create_post" element={<CreatePostComponent />} />
                <Route path="/messages" element={<MessagePage />} />
                <Route path="/messages/:recipientId" element={<UserMessage />} />
                <Route path="/search" element={<SearchBar />} />
                <Route path="/account/update/" element={<UserProfileUpdate />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/discover" element={<RecommendedPosts />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
