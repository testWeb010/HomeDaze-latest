
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page 
              ? 'bg-blue-600 text-white' 
              : 'border border-gray-300 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {page}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
