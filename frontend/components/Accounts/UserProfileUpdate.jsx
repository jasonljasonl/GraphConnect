import { useState, useEffect } from "react";
import axios from "axios";
import { getConnectedUser, updateUserProfile } from "../services/api";

const UserProfileUpdate = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        profile_picture: null,
    });

    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(getConnectedUser, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                setUserData({
                    username: response.data.username,
                    email: response.data.email,
                    profile_picture: response.data.profile_picture || null,
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUserData({ ...userData, profile_picture: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (userData.username) {
            formData.append("username", userData.username);
        }
        if (userData.email) {
            formData.append("email", userData.email);
        }

        if (userData.profile_picture) {
          formData.append("profile_picture", userData.profile_picture);
        }


        try {
            await axios.put(updateUserProfile, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            setMessage("Profile updated successfully.");
        } catch (error) {
            setMessage("Error updating profile.");
        }
    };

    return (
        <div>
            <h2>Update Profile</h2>
            {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        name="profile_picture"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && <img src={preview} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UserProfileUpdate;
