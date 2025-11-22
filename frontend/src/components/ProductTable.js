import React from 'react';
import './ProductTable.css';
import ProductRow from './ProductRow';

function ProductTable({ products, loading, onUpdate, onDelete, onProductSelect, sortBy, sortOrder, onSort }) {
  const SortIcon = ({ field }) => {
    if (sortBy !== field) {
      return <span className="sort-icon">⇅</span>;
    }
    return <span className="sort-icon">{sortOrder === 'ASC' ? '↑' : '↓'}</span>;
  };

  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p>📭 No products found</p>
          <p className="empty-subtitle">Try adding a new product or adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th 
              className="sortable" 
              onClick={() => handleSort('name')}
              title="Click to sort"
            >
              Name <SortIcon field="name" />
            </th>
            <th>Unit</th>
            <th 
              className="sortable" 
              onClick={() => handleSort('category')}
              title="Click to sort"
            >
              Category <SortIcon field="category" />
            </th>
            <th 
              className="sortable" 
              onClick={() => handleSort('brand')}
              title="Click to sort"
            >
              Brand <SortIcon field="brand" />
            </th>
            <th 
              className="sortable" 
              onClick={() => handleSort('stock')}
              title="Click to sort"
            >
              Stock <SortIcon field="stock" />
            </th>
            <th 
              className="sortable" 
              onClick={() => handleSort('status')}
              title="Click to sort"
            >
              Status <SortIcon field="status" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onSelect={onProductSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
