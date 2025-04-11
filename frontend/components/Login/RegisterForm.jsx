import { useState } from "react";
import axios from "axios";
import { registerUser } from "../services/api";

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, profile_picture: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const uploadToCloud = async (file) => {
        const data = new FormData();
        data.append("file", file);

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
            setError("Registration error.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Registration</h2>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />

                <div>
                    <label>Profile Picture:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {preview && <img src={preview} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
