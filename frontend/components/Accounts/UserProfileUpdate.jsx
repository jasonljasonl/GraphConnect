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
                const response = await getConnectedUser();
                setUserData({
                    username: response.data.username,
                    email: response.data.email,
                    profile_picture: response.data.profile_picture || null,
                });
                setPreview(response.data.profile_picture);
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

    let uploadedUrl = null;

    try {
        if (userData.profile_picture instanceof File) {
            uploadedUrl = await uploadToCloud(userData.profile_picture);
        }

        const dataToSend = {
            username: userData.username,
            email: userData.email,
        };

        if (uploadedUrl) {
            dataToSend.profile_picture = uploadedUrl;
        }

        await updateUserProfile(dataToSend);
        setMessage("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error);
        setMessage("Error updating profile");
    }
};


const uploadToCloud = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        "https://graphconnect-695590394372.europe-west1.run.app/api/account/upload-profile-picture/",
        formData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data.url;
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