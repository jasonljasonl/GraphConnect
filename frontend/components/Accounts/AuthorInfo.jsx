import { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const AuthorInfo = ({ username }) => {
    const [profile, setProfile] = useState(null);

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
        <div className="author_component">
            <img
                className="author_profile_picture_component"
                src={`https://storage.googleapis.com/graph-connect_bucket/media/${profile.profile_picture}`}
                alt="Profile"
            />
            <p>{profile.username}</p>
        </div>
    );
};

export default AuthorInfo;
