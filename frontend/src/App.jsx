import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from '../components/Homepage.jsx';
import GetUsers from '../components/Accounts/GetUsersComponent.jsx';
import { NavBar } from '../components/NavBar.jsx';
import { LoginPage } from "../components/Login/LoginPage";
import { RegisterPage } from "../components/Login/RegisterPage";
import { Logout } from "../components/Login/Logout";
import ViewPostPage from '../components/Posts/ViewPostPage.jsx';
import CreatePostComponent from '../components/Posts/CreatePostComponent.jsx';
import MessagePage from '../components/Chatting/MessagePage.jsx';
import UserMessage from '../components/Chatting/UserMessage.jsx';
import SearchBar from '../components/Accounts/SearchBar.jsx';
import ProfilePage from '../components/Accounts/Profilepage.jsx';
import UserProfileUpdate from '../components/Accounts/UserProfileUpdate.jsx';
import RecommendedPosts from '../components/Posts/RecommendedPosts.jsx';
import ProtectedRoute from '../components/ProtectedRoutes.jsx';
import Layout from '../components/Layout.jsx';


function App() {
    return (
        <BrowserRouter>
            <Layout>

                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/logout" element={<Logout />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Homepage />
                        </ProtectedRoute>
                    } />
                    <Route path="/posts/:postId" element={
                        <ProtectedRoute>
                            <ViewPostPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/create_post" element={
                        <ProtectedRoute>
                            <CreatePostComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                        <ProtectedRoute>
                            <MessagePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/messages/:recipientId" element={
                        <ProtectedRoute>
                            <UserMessage />
                        </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                        <ProtectedRoute >
                            <SearchBar />
                        </ProtectedRoute>
                    } />
                    <Route path="/account/update/" element={
                        <ProtectedRoute>
                            <UserProfileUpdate />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile/:username" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/discover" element={
                        <ProtectedRoute>
                            <RecommendedPosts />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Layout>
            <NavBar />
        </BrowserRouter>
    );
}

export default App;
