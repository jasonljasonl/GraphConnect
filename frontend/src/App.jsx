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

function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<Post />} />  {/* Show posts only on home */}
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/posts/:postId" element={<ViewPostPage />} />
                <Route path="/create_post" element={<CreatePostComponent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
