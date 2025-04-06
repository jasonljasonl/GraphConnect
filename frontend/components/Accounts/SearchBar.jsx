import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../services/api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      setLoading(true);
      setError(null);

    try {
      const response = await searchUsers(value);
      console.log("Réponse API :", response);


      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else if (Array.isArray(response.data.users)) {
        setResults(response.data.users);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching search results.");
    } finally {
      setLoading(false);
    }
  } else {
    setResults([]);
  }
};


  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search a user..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul>
        {results.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              navigate(`/profile/${user.username}`);
              setQuery("");
              setResults([]);
            }}
          >
            <div className="author_component">
              {user.profile_picture ? (
                <img
                  src={`https://graphconnect-695590394372.europe-west1.run.app/api/${user.profile_picture}`}
                  className="author_profile_picture_component"
                  alt={`${user.username}'s profile`}
                />
              ) : (
                <div className="default-avatar"></div>
              )}
              <p className="post_author_component">{user.username}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
