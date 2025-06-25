import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import RegisterForm from "./RegisterForm.jsx";
import LoginForm from './LoginForm.jsx';
import axios from "axios";
import '../css/LoginPage.css';


export const RegisterPage = () => {


  return (
    <div>
        <RegisterForm />
    </div>
  );
};
