import React, { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../library/constants";

const SearchBar = ({ onSelectUser }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/user/search?email=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-slate-500"
        />
        <button
          type="submit"
          className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-2 text-sm text-gray-500">Searching...</p>}

      <ul className="mt-2">
        {results.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
