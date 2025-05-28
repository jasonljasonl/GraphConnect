<<<<<<< HEAD
import { useState, useRef } from "react";
import axios from "axios";
import { registerUser } from "../services/api";
import '../css/LoginPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

=======
import { useState } from "react";
import axios from "axios";
import { registerUser } from "../services/api";
>>>>>>> temp_cloud_run

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

<<<<<<< HEAD
    const fileInputRef = useRef(null);

=======
>>>>>>> temp_cloud_run
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
<<<<<<< HEAD
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
=======
        setFormData({ ...formData, profile_picture: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
>>>>>>> temp_cloud_run
    };

    const uploadToCloud = async (file) => {
        const data = new FormData();
        data.append("file", file);

<<<<<<< HEAD
        try {
            const response = await axios.post(
                "https://graphconnect-695590394372.europe-west1.run.app/api/account/upload-profile-picture/",
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
=======
        const response = await axios.post(
            "https://graphconnect-695590394372.europe-west1.run.app/api/account/upload-profile-picture/",
            data,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.url;
>>>>>>> temp_cloud_run
    };

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
                profile_picture: profile_picture_url,
            };

            await registerUser(dataToSend);

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
<<<<<<< HEAD
            setError(err.response?.data?.detail || "Registration error. Please try again.");
=======
            setError("Registration error.");
>>>>>>> temp_cloud_run
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Registration</h2>
<<<<<<< HEAD
            {message && <p className="text-green-500 text-center mb-2">{message}</p>}
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}
=======
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
>>>>>>> temp_cloud_run
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />

<<<<<<< HEAD
                <div className="flex flex-col items-center">
                    <label className="mb-2 text-gray-700">Profile Picture:</label>
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

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 login-button">
=======
                <div>
                    <label>Profile Picture:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {preview && <img src={preview} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
>>>>>>> temp_cloud_run
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
