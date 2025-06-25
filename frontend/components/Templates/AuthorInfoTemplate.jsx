import { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";
import '../css/AuthorInfo.css';
import { useNavigate } from "react-router-dom";


const API_BASE_URL = "http://localhost:8080/api";
const LINK_BASE_URL = "http://localhost:8080";

const AuthorInfoTemplate = ({ username }) => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile(username);
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
    }, [username]);

    if (!profile) return null;

    return (
        <div className="author_component"
        onClick={() =>
                navigate(`/profile/${profile.username}`)
              }>
            <img
                className="author_profile_picture_component"
                src={`${LINK_BASE_URL}${profile.profile_picture}`}
                alt="Profile"
            />
            <p>{profile.username}</p>
        </div>
    );
};

export default AuthorInfoTemplate;
