import { getReferralHistory } from "@/api/giveWay/giveWay.api";
import { useTheme } from "@/hooks/custom/useTheme";
import { History, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./promo.css";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const [showMorePages, setShowMorePages] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      <div className="flex items-center gap-1 ml-auto">
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

        <div className="flex items-center gap-1 mx-2">{getPageButtons()}</div>

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

const PromoHistory = () => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("slot");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const itemsPerPage = 5;

  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const mutedTextClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const bgClass = theme === "dark" ? "bg-mediumBlack/50" : "bg-white";
  const borderClass = theme === "dark" ? "border-gray-800" : "border-gray-200";
  const headerBgClass = theme === "dark" ? "bg-gray-800/50" : "bg-gray-50";
  const dropdownBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const hoverClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const skeletonClass =
    theme === "dark"
      ? "animate-pulse bg-gray-700/70 rounded"
      : "animate-pulse bg-gray-200/70 rounded";

  const filterOptions = [
    { value: "slot", label: "Slot" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "ultimate", label: "Exclusive" },
  ];

  // Get type-based colors
  const getTypeColors = (type) => {
    const typeValue = type?.toLowerCase();

    if (typeValue === "slot" || typeValue === "gift") {
      return "bg-blue-300 text-blue-700";
    } else if (typeValue === "weekly") {
      return "bg-green-300 text-green-700";
    } else if (typeValue === "monthly") {
      return "bg-purple-300 text-purple-700";
    } else if (
      type === "EXCLUSIVE" ||
      typeValue === "exclusive" ||
      typeValue?.includes("exclusive")
    ) {
      return "bg-yellow-300 text-yellow-700";
    }
    return "bg-blue-300 text-blue-700";
  };

  // Format type to camel case
  const formatType = (type) => {
    if (!type) return "Unknown";
    const typeStr = String(type).toUpperCase();
    if (typeStr === "EXCLUSIVE") return "Exclusive";
    if (typeStr === "GIFT") return "Code";
    return typeStr.charAt(0) + typeStr.slice(1).toLowerCase();
  };

  // Toggle card expansion
  const toggleCard = (itemId) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Fetch data - Remove the limit parameter to get all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setExpandedCards(new Set());
      setCurrentPage(1); // Reset to page 1 when filter changes
      try {
        // Remove limit parameter or set it high to get all records
        const res = await getReferralHistory(selectedFilter);
        if (res.success) {
          let data = [];
          if (selectedFilter === "slot")
            data = res.data.slot_machine_wins || [];
          else if (selectedFilter === "weekly")
            data = res.data.weekly_giveaways || [];
          else if (selectedFilter === "monthly")
            data = res.data.monthly_giveaways || [];
          else if (selectedFilter === "ultimate")
            data = res.data.ultimate_giveaways || [];
          setHistoryData(data);
        } else {
          setError("Failed to load referral history");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load referral history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";

    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format prize based on type
  const formatPrize = (item) => {
    const amount = parseFloat(
      item.prize_amount || item.discount_won || 0,
    ).toFixed(2);
    const type = item.giveaway_type || item.reward_type;

    // If type is SLOT or selectedFilter is slot, show percentage
    if (type?.toUpperCase() === "SLOT" || selectedFilter === "slot") {
      return `${amount}%`;
    }

    // Otherwise show dollar amount
    return `$${amount}`;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = historyData.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 w-full overflow-hidden xl:max-w-[600px]">
      {/* Card */}
      <div
        className={`rounded-xl sm:rounded-2xl ${bgClass} p-3 sm:p-4 lg:p-6 shadow-lg border ${borderClass} w-full`}
      >
        {/* Filter Dropdown */}
        <div className="flex justify-start mb-4 sm:mb-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border ${borderClass} ${bgClass} ${textClass} text-xs sm:text-sm font-medium transition-all ${hoverClass}`}
            >
              {filterOptions.find((opt) => opt.value === selectedFilter)
                ?.label || "Slot"}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                className={`absolute left-0 sm:right-0 mt-2 w-40 sm:w-48 rounded-lg sm:rounded-xl border ${borderClass} ${dropdownBgClass} shadow-2xl overflow-hidden z-50`}
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${textClass} transition-colors ${
                      selectedFilter === option.value
                        ? "bg-blue-500/20 font-semibold"
                        : hoverClass
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-red-500 mb-4 text-sm sm:text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:underline font-medium text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Desktop Table View */}
        {!error && (
          <div className="hidden md:block w-full overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle max-h-[800px] thin-scrollbar">
                <table className="min-w-[800px] w-full text-left mb-10">
                  <thead>
                    <tr
                      className={`border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${mutedTextClass}`}
                      >
                        Date
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${mutedTextClass}`}
                      >
                        Winner
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${mutedTextClass}`}
                      >
                        Title
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${mutedTextClass}`}
                      >
                        Type
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${mutedTextClass}`}
                      >
                        Prize
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <tr
                          key={idx}
                          className={`text-sm ${
                            theme === "dark"
                              ? "border-gray-800"
                              : "border-gray-100"
                          } border-b`}
                        >
                          <td className="py-4 px-4">
                            <div
                              className={`${skeletonClass} h-4 lg:h-5 w-24 max-w-full`}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div
                              className={`${skeletonClass} h-4 lg:h-5 w-16 max-w-full`}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div
                              className={`${skeletonClass} h-4 lg:h-5 w-20 max-w-full`}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div
                              className={`${skeletonClass} h-4 lg:h-5 w-12 max-w-full`}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div
                              className={`${skeletonClass} h-4 lg:h-5 w-12 max-w-full`}
                            />
                          </td>
                        </tr>
                      ))
                    ) : paginatedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 lg:py-16 text-center text-gray-500 text-base lg:text-lg"
                        >
                          No {selectedFilter} giveaways found
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr
                          key={item.id}
                          className={`text-sm ${
                            theme === "dark"
                              ? "border-gray-800"
                              : "border-gray-100"
                          } border-b`}
                        >
                          <td
                            className={`py-4 text-sm px-4 ${textClass} font-medium`}
                          >
                            {formatDate(
                              item.winner_announced_at ||
                                item.pulled_at ||
                                item.date,
                            )}
                          </td>

                          <td
                            className={`py-4 text-sm px-4 ${textClass} font-medium`}
                          >
                            {item.winner_username ||
                              item.username ||
                              "Anonymous"}
                          </td>

                          <td className={`py-4 text-sm px-4 ${textClass}`}>
                            {item.giveaway_title || "Slot Machine"}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs font-semibold tracking-wide ${getTypeColors(
                                item.giveaway_type,
                              )}`}
                            >
                              {formatType(
                                item.giveaway_type || item.reward_type,
                              )}
                            </span>
                          </td>
                          <td
                            className={`py-4 font-medium text-sm px-4 ${textClass}`}
                          >
                            {formatPrize(item)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Desktop Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Card View - Expandable */}
        {!error && (
          <div className="md:hidden space-y-3 w-full">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`${bgClass} border ${borderClass} rounded-lg p-4 space-y-3 w-full`}
                >
                  <div className={`${skeletonClass} h-4 w-2/3 max-w-full`} />
                  <div className={`${skeletonClass} h-4 w-1/2 max-w-full`} />
                  <div className={`${skeletonClass} h-8 w-24 max-w-full`} />
                </div>
              ))
            ) : paginatedData.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No {selectedFilter} giveaways found
              </div>
            ) : (
              paginatedData.map((item) => {
                const isExpanded = expandedCards.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`${bgClass} border ${borderClass} rounded-lg p-4 space-y-3 transition-all`}
                  >
                    {/* Always visible: Winner & Type */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`${textClass} font-semibold text-base`}>
                          {item.winner_username || item.username || "Anonymous"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs font-semibold tracking-wide ${getTypeColors(
                          item.giveaway_type,
                        )}`}
                      >
                        {formatType(item.giveaway_type || item.reward_type)}
                      </span>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-gray-700">
                        <div>
                          <p
                            className={`${mutedTextClass} text-xs uppercase tracking-wide mb-1`}
                          >
                            Date
                          </p>
                          <p className={`${textClass} text-sm`}>
                            {formatDate(
                              item.winner_announced_at ||
                                item.pulled_at ||
                                item.date,
                            )}
                          </p>
                        </div>

                        <div>
                          <p
                            className={`${mutedTextClass} text-xs uppercase tracking-wide mb-1`}
                          >
                            Title
                          </p>
                          <p className={`${textClass} text-sm`}>
                            {item.giveaway_title || "Slot Machine"}
                          </p>
                        </div>

                        <div>
                          <p
                            className={`${mutedTextClass} text-xs uppercase tracking-wide mb-1`}
                          >
                            Prize
                          </p>
                          <p className={`${textClass} font-semibold text-base`}>
                            {formatPrize(item)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* See Details Button */}
                    <button
                      onClick={() => toggleCard(item.id)}
                      className={`flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors -mt-2`}
                    >
                      {isExpanded ? "Hide Details" : "See Details"}
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                );
              })
            )}

            {/* Mobile Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoHistory;
