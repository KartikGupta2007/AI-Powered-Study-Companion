import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useDebounce from '../hooks/useDebounce';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
      <FaSearch className="pl-3 text-gray-400 text-base" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="flex-1 border-none px-4 py-3 text-sm bg-transparent focus:outline-none placeholder-gray-400"
      />
      {query && (
        <button 
          onClick={handleClear} 
          className="pr-3 text-gray-400 hover:text-gray-600 transition text-base"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
