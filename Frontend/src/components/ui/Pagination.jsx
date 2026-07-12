import React from 'react';

export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-center mt-4" aria-label="Page navigation">
      <ul className="pagination gap-1">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link border-0 rounded-3 text-secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ backgroundColor: 'var(--surface)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button
              className={`page-link border-0 rounded-3 ${currentPage === page ? 'text-white' : 'text-secondary'}`}
              onClick={() => onPageChange(page)}
              style={{
                backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--surface)',
                boxShadow: currentPage === page ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link border-0 rounded-3 text-secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ backgroundColor: 'var(--surface)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};
