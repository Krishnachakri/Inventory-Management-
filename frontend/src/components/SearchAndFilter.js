import React from 'react';
import './SearchAndFilter.css';

function SearchAndFilter({
  searchQuery,
  onSearch,
  categories,
  categoryFilter,
  onCategoryFilter,
}) {
  return (
    <div className="search-and-filter">
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        className="category-filter"
        value={categoryFilter}
        onChange={(e) => onCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchAndFilter;


