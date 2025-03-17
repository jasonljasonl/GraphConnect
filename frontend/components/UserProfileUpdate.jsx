import { useState, useEffect } from "react";
import axios from "axios";

const UserProfileUpdate = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        profile_picture: null,
    });

    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;

                const response = await axios.get("http://127.0.0.1:8000/api/connected-user/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
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
            const response = await fetch("http://127.0.0.1:8000/account/update/", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                setMessage("updated successfully");
            } else {
                setMessage("Error");
            }
        } catch (error) {
            console.error("Error :", error);
            setMessage("Error");
        }
    };

    return (
        <div>
            <h2>Update profile</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Username :</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email :</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Profile picture :</label>
                    <input
                        type="file"
                        name="profile_picture"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && <img src={preview} alt="Aperçu" style={{ width: "100px", marginTop: "10px" }} />}
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UserProfileUpdate;
