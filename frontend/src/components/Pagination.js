import React from 'react';
import './Pagination.css';

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { page, totalPages, hasNext, hasPrev } = pagination;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    const pages = [];
    
    if (startPage > 1) {
      pages.push(
        <button key={1} className="page-btn" onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${i === page ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="page-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPrev}
      >
        ‹ Previous
      </button>
      <div className="page-numbers">
        {renderPageNumbers()}
      </div>
      <button
        className="page-btn nav-btn"
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNext}
      >
        Next ›
      </button>
    </div>
  );
}

export default Pagination;

