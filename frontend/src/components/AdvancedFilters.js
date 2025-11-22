import React, { useState } from 'react';
import './AdvancedFilters.css';

function AdvancedFilters({ onFilterChange, categories, onReset }) {
  const [filters, setFilters] = useState({
    minStock: '',
    maxStock: '',
    multipleCategories: [],
    brands: [],
    status: '',
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = filters.multipleCategories.includes(category)
      ? filters.multipleCategories.filter(c => c !== category)
      : [...filters.multipleCategories, category];
    
    handleFilterChange('multipleCategories', newCategories);
  };

  const handleReset = () => {
    const resetFilters = {
      minStock: '',
      maxStock: '',
      multipleCategories: [],
      brands: [],
      status: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    if (onReset) onReset();
  };

  // Get unique brands (would come from props or API)
  const brands = ['Apple', 'Dell', 'HP', 'Samsung', 'Logitech', 'IKEA', 'Bic', 'Moleskine'];

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <h3>🔍 Advanced Filters</h3>
        <button className="btn-reset" onClick={handleReset}>Reset</button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Stock Range</label>
          <div className="stock-range">
            <input
              type="number"
              placeholder="Min"
              value={filters.minStock}
              onChange={(e) => handleFilterChange('minStock', e.target.value)}
              min="0"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxStock}
              onChange={(e) => handleFilterChange('maxStock', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {categories.length > 0 && (
          <div className="filter-group">
            <label>Categories (Multiple)</label>
            <div className="category-checkboxes">
              {categories.slice(0, 8).map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.multipleCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="filter-group">
          <label>Brands (Multiple)</label>
          <div className="brand-checkboxes">
            {brands.map((brand) => (
              <label key={brand} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(e) => {
                    const newBrands = e.target.checked
                      ? [...filters.brands, brand]
                      : filters.brands.filter(b => b !== brand);
                    handleFilterChange('brands', newBrands);
                  }}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedFilters;

