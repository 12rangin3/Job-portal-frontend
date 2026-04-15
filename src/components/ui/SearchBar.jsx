import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/jobs?search=${query}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4 px-3">
      <div className="input-group shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
        <input
          className="form-control form-control-lg border-0"
          placeholder="Search for jobs, companies, or locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ borderRadius: '50px 0 0 50px' }}
        />
        <button 
          className="btn btn-primary px-4" 
          onClick={handleSearch}
          style={{ borderRadius: '0 50px 50px 0' }}
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;