import React from 'react';
import './App.css';
import Post from '../components/PostComponent.jsx';
import GetUsers from '../components/getUsersComponent.jsx';
import { NavBar } from '../components/NavBar.jsx';
import { Login } from "../components/Login";
import { Logout } from "../components/Logout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../components/axios';
import ViewPostPage from '../components/ViewPostPage.jsx';
import CreatePostComponent from '../components/CreatePostComponent.jsx';
import MessagePage from '../components/MessagePage.jsx';
import UserMessage from '../components/UserMessage.jsx';
import SearchBar from '../components/SearchBar.jsx'
import ProfilePage from '../components/ProfilePage.jsx'
import UserProfileUpdate from '../components/UserProfileUpdate.jsx'

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

            </Routes>
        </BrowserRouter>
    );
}

export default App;
