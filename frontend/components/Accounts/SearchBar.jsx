import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/search/?q=${value}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error", error);
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
      <ul>
        {results.map((user) => (
          <li key={user.id} onClick={() => navigate(`/profile/${user.username}`)} >
              <div className='author_component'>
                <img src={`http://127.0.0.1:8000${user.profile_picture}`} className='author_profile_picture_component' />
                <p className='post_author_component'>{user.username}</p>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;