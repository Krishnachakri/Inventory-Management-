import React, { useState } from 'react';
import './ProductRow.css';

function ProductRow({ product, onUpdate, onDelete, onSelect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: product.name,
    unit: product.unit || '',
    category: product.category || '',
    brand: product.brand || '',
    stock: product.stock,
    status: product.status || (product.stock > 0 ? 'In Stock' : 'Out of Stock'),
    image: product.image || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      name: product.name,
      unit: product.unit || '',
      category: product.category || '',
      brand: product.brand || '',
      stock: product.stock,
      status: product.status || (product.stock > 0 ? 'In Stock' : 'Out of Stock'),
      image: product.image || '',
    });
  };

  const handleSave = async () => {
    try {
      await onUpdate(product.id, editedData);
      setIsEditing(false);
    } catch (error) {
      
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'stock') {
        const stock = parseInt(value, 10) || 0;
        updated.status = stock > 0 ? 'In Stock' : 'Out of Stock';
      }
      return updated;
    });
  };

  const getStatusClass = (stock) => (stock > 0 ? 'status-in-stock' : 'status-out-of-stock');
  const getStatusText = (stock) => (stock > 0 ? 'In Stock' : 'Out of Stock');

  if (isEditing) {
    const statusClass = getStatusClass(editedData.stock);
    const statusText = getStatusText(editedData.stock);
    return (
      <tr className="editing-row" onClick={(e) => e.stopPropagation()}>
        <td>
          <img
            src={editedData.image || '/placeholder-image.png'}
            alt={editedData.name}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/50';
            }}
          />
        </td>
        <td>
          <input
            type="text"
            value={editedData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="edit-input"
          />
        </td>
        <td>
          <input
            type="text"
            value={editedData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="edit-input"
          />
        </td>
        <td>
          <input
            type="text"
            value={editedData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="edit-input"
          />
        </td>
        <td>
          <input
            type="text"
            value={editedData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="edit-input"
          />
        </td>
        <td>
          <input
            type="number"
            value={editedData.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            className="edit-input"
            min="0"
          />
        </td>
        <td>
          <span className={`status-badge ${statusClass}`}>{statusText}</span>
        </td>
        <td>
          <div className="action-buttons">
            <button className="btn btn-success btn-small" onClick={handleSave}>
              ✓ Save
            </button>
            <button className="btn btn-secondary btn-small" onClick={handleCancel}>
              ✗ Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr onClick={() => onSelect(product)}>
      <td>
        <img
          src={product.image || '/placeholder-image.png'}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/50';
          }}
        />
      </td>
      <td>{product.name}</td>
      <td>{product.unit || '-'}</td>
      <td>{product.category || '-'}</td>
      <td>{product.brand || '-'}</td>
      <td>{product.stock}</td>
      <td>
        <span className={`status-badge ${getStatusClass(product.stock)}`}>
          {getStatusText(product.stock)}
        </span>
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <div className="action-buttons">
          <button className="btn btn-primary btn-small" onClick={handleEdit}>
            ✏️ Edit
          </button>
          <button
            className="btn btn-danger btn-small"
            onClick={() => onDelete(product.id)}
          >
            🗑️ Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;

