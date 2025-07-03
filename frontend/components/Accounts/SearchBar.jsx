import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../services/api";
import AuthorInfoTemplate from '../Templates/AuthorInfoTemplate.jsx';

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
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul className="search-results">
        {results.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              navigate(`/profile/${user.username}`);
              setQuery("");
              setResults([]);
            }}
            style={{ cursor: "pointer" }}
          >
            <AuthorInfoTemplate username={user.username} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
