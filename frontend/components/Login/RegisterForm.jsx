import { useState, useRef } from "react";
import axios from "axios";
import { registerUser } from "../services/api";
import '../css/LoginPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        profile_picture: null,
    });

    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profile_picture: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, profile_picture: null });
            setPreview(null);
        }
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const uploadToCloud = async (file) => {
        const data = new FormData();
        data.append("file", file);

        try {
            const response = await axios.post(
                //"https://graphconnect-695590394372.europe-west1.run.app/api/account/upload-profile-picture/",
                "http://localhost:8080/api/account/upload-profile-picture/",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.url;
        } catch (uploadError) {
            console.error("Error uploading profile picture:", uploadError);
            throw new Error("Failed to upload profile picture.");
        }
    };



/*
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            let profile_picture_url = null;

            if (formData.profile_picture instanceof File) {
                profile_picture_url = await uploadToCloud(formData.profile_picture);
            }

            const dataToSend = {
                username: formData.username,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                //profile_picture: profile_picture_url,
                if (formData.profile_picture instanceof File) {
                    form.append("profile_picture", formData.profile_picture);
                }
            };

            //

            await axios.post("http://localhost:8001/register/", form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setMessage("Registration successful!");
            setFormData({
                username: "",
                name: "",
                email: "",
                password: "",
                profile_picture: null,
            });
            setPreview(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Registration error. Please try again.");
        }
    };
*/

const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
        const form = new FormData();
        form.append("username", formData.username);
        form.append("name", formData.name);
        form.append("email", formData.email);
        form.append("password", formData.password);

        if (formData.profile_picture instanceof File) {
            form.append("profile_picture", formData.profile_picture);
        }

        await axios.post("http://localhost:8080/api/register/", form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        setMessage("Registration successful!");
        setFormData({
            username: "",
            name: "",
            email: "",
            password: "",
            profile_picture: null,
        });
        setPreview(null);
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Registration error. Please try again.");
    }
};




    return (
        <div className="max-w-md mx-auto p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Registration</h2>
            {message && <p className="text-green-500 text-center mb-2">{message}</p>}
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="username" className="block text-sm/6 font-medium">
                    Username
                </label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base   outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />

                <label htmlFor="name" className="block text-sm/6 font-medium  ">
                    Name
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base   outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />

                <label htmlFor="email" className="block text-sm/6 font-medium  ">
                    Email address
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base   outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />

                <label htmlFor="password" className="block text-sm/6 font-medium  ">
                    Password
                </label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base   outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />

                <div className="flex flex-col items-center profile_picture_div">
                    <label className="mb-2">Profile Picture:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />

                    <div className="upload-icon-container" onClick={handleIconClick}>
                        {preview ? (
                            <img src={preview} alt="Profile Preview" className="profile-preview-thumbnail" />
                        ) : (
                            <FontAwesomeIcon icon={faCamera} className="upload-icon" />
                        )}
                    </div>
                </div>

                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 button_register_login">
                    Sign up
                </button>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Already registered ?{' '}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 link_register">
              Log in
            </a>
          </p>

        </div>
    );
};

export default RegisterForm;
