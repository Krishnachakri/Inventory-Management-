import React, { useState, useEffect } from 'react';
import './InventoryHistory.css';
import { productsAPI } from '../services/api';

function InventoryHistory({ product, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getHistory(product.id);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (product) {
      fetchHistory();
    }
  }, [product]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h3>Inventory History</h3>
          <button className="history-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="history-product-info">
          <strong>{product.name}</strong>
          <span>Current Stock: {product.stock}</span>
        </div>
        <div className="history-content">
          {loading ? (
            <div className="history-loading">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="history-empty">No inventory changes recorded</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Old Stock</th>
                  <th>New Stock</th>
                  <th>Changed By</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatDate(entry.change_date)}</td>
                    <td>{entry.old_quantity}</td>
                    <td>
                      <span className={entry.new_quantity > entry.old_quantity ? 'stock-increase' : 'stock-decrease'}>
                        {entry.new_quantity}
                      </span>
                    </td>
                    <td>{entry.user_info || 'admin'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryHistory;


