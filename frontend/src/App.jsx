import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Post from '../components/PostComponent.jsx'
import {NavBar} from '../components/NavBar.jsx'
import {Login} from "../components/Login";
import {Logout} from "../components/Logout";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import '../components/axios';


function App() {


    return (
    <>

       <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
        </Routes>
      </BrowserRouter>;


      <Post />
    </>
    )
}

export default App
