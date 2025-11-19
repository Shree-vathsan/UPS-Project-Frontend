import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="w-full flex items-center justify-center py-10 gap-4 text-sm">
      
      {/* Previous button */}
      <button
        className="px-4 py-2 border rounded-lg bg-white disabled:opacity-40"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Previous
      </button>

      {/* Page Indicator */}
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next button */}
      <button
        className="px-4 py-2 border rounded-lg bg-white disabled:opacity-40"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
