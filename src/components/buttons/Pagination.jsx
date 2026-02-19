import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  perPageOptions = [10, 20, 50, 100],
  currentPerPage,
  onPerPageChange,
}) => {
  const [showMorePages, setShowMorePages] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const getPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Always show first page
    buttons.push(
      <button
        key={1}
        className={`min-w-8 h-8 rounded-md xl:text-sm text-xs flex items-center justify-center transition-all duration-200 font-medium cursor-pointer ${
          currentPage === 1
            ? "bg-darkBlue text-white"
            : "bg-lighterGrey text-mediumBlack hover:bg-darkBlue hover:text-white"
        }`}
        onClick={() => {
          onPageChange(1);
          setShowMorePages(false);
        }}
      >
        1
      </button>,
    );

    // Show left ellipsis if needed
    if (
      currentPage > halfVisible + 2 &&
      totalPages > maxVisiblePages &&
      !showMorePages
    ) {
      buttons.push(
        <button
          key="left-ellipsis"
          className="min-w-8 h-8 rounded-md xl:text-sm text-xs flex items-center justify-center cursor-pointer bg-gray-100 text-darkGrey"
          onClick={() => setShowMorePages(true)}
        >
          ...
        </button>,
      );
    }

    // Calculate page range to show
    let startPage = 2;
    let endPage = totalPages - 1;

    if (!showMorePages && totalPages > maxVisiblePages) {
      if (currentPage <= halfVisible + 1) {
        endPage = maxVisiblePages - 1;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 2;
      } else {
        startPage = currentPage - halfVisible + 1;
        endPage = currentPage + halfVisible - 1;
      }
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        buttons.push(
          <button
            key={i}
            className={`min-w-8 h-8 rounded-md xl:text-sm text-xs flex items-center justify-center transition-all duration-200 font-medium cursor-pointer ${
              currentPage === i
                ? "bg-darkBlue text-white"
                : "bg-lighterGrey text-mediumBlack hover:bg-darkBlue hover:text-white"
            }`}
            onClick={() => {
              onPageChange(i);
              setShowMorePages(false);
            }}
          >
            {i}
          </button>,
        );
      }
    }

    // Show right ellipsis if needed
    if (
      currentPage < totalPages - halfVisible - 1 &&
      totalPages > maxVisiblePages &&
      !showMorePages
    ) {
      buttons.push(
        <button
          key="right-ellipsis"
          className="min-w-8 h-8 rounded-md xl:text-sm text-xs flex items-center justify-center cursor-pointer bg-gray-100 text-darkGrey"
          onClick={() => setShowMorePages(true)}
        >
          ...
        </button>,
      );
    }

    // Always show last page if there is more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`min-w-8 h-8 rounded-md xl:text-sm text-xs flex items-center justify-center transition-all duration-200 font-medium cursor-pointer ${
            currentPage === totalPages
              ? "bg-darkBlue text-white"
              : "bg-lighterGrey text-mediumBlack hover:bg-darkBlue hover:text-white"
          }`}
          onClick={() => {
            onPageChange(totalPages);
            setShowMorePages(false);
          }}
        >
          {totalPages}
        </button>,
      );
    }

    return buttons;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      {/* Per page selector - left side */}
      {/* {onPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="xl:text-sm text-xs text-gray-600">Items per page:</span>
          <select
            value={currentPerPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 xl:text-sm text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {perPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )} */}

      {/* Pagination - right side */}
      <div className="flex items-center gap-1 ml-auto">
        {/* prev button */}
        <button
          className={`p-2 rounded-md flex items-center justify-center ${
            currentPage === 1
              ? "text-mediumGrey cursor-not-allowed"
              : "text-darkGrey hover:bg-gray-100 cursor-pointer"
          }`}
          onClick={() => {
            onPageChange(currentPage - 1);
            setShowMorePages(false);
          }}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack className="text-lg" />
        </button>

        {/* Page buttons */}
        <div className="flex items-center gap-1 mx-2">{getPageButtons()}</div>

        {/* next button */}
        <button
          className={`p-2 rounded-md flex items-center justify-center ${
            currentPage === totalPages
              ? "text-mediumGrey cursor-not-allowed"
              : "text-darkGrey hover:bg-gray-100 cursor-pointer"
          }`}
          onClick={() => {
            onPageChange(currentPage + 1);
            setShowMorePages(false);
          }}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
