import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import RegisterForm from "./RegisterForm.jsx";
import LoginForm from './LoginForm.jsx';
import axios from "axios";
import '../css/LoginPage.css';

export const LoginPage = () => {


  return (
    <div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">

              <img
            alt="GraphConnect logo"
            src="https://i.ibb.co/219V1fYp/logo.png"
            className="mt-10 mx-auto h-10 w-auto logo_graphconnect"
          />


          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight">
            Stay connected with your friends with <span className='title_graphconnect'>GraphConnect</span>
          </h2>
        </div>

        <LoginForm />

    </div>
  );
};
