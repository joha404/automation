import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import team from "@/assets/dashboard/team.jpg";
import { FaCircle, FaRegClock, FaRegFileAlt } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { useSidebar } from "@/hooks/custom/useSidebar";
import SearchField from "@/components/forms/SearchField";
import Pagination from "@/components/buttons/Pagination";
import { useSearchParams } from "react-router-dom";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { TbDeviceGamepad2 } from "react-icons/tb";

const AllPastPrediction = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get search parameters from URL
  const status = searchParams.get("status") || "";
  const unitSize = searchParams.get("unit_size") || "";
  const type = searchParams.get("type") || "";
  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("page") || "1";

  // Prepare query parameters for the API
  const queryParams = {
    status: status || undefined,
    unit_size: unitSize || undefined,
    type: type || undefined,
    search: searchQuery || undefined,
    page: page || undefined,
  };

  // Remove undefined values
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === undefined) {
      delete queryParams[key];
    }
  });

  // Use the custom hook to fetch data
  const { data, isLoading, error } = useGet("/past-predictions/", {
    params: queryParams,
    queryKey: ["past-predictions", queryParams],
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "L":
        return "text-[#FFDB5B]";
      case "S":
        return "text-lightGrey";
      case "PP":
        return "text-green-400";
      case "POTD":
        return "text-purple-400";
      case "P":
        return "text-yellow-400";
      case "win":
        return "text-[#0A9087] border border-[#0A9087]";
      case "loss":
        return "text-rose-600 border border-rose-600";
      default:
        return "text-lightBlue";
    }
  };

  // Handle search
  const handleSearch = (query) => {
    const params = new URLSearchParams();

    params.delete("status");
    params.delete("unit_size");
    params.delete("type");
    params.delete("search");

    if (query) {
      const statusValues = ["win", "loss", "pending"];

      if (statusValues.includes(query.toLowerCase())) {
        params.set("status", query.toLowerCase());
      } else if (/^\d+(\.\d+)?$/.test(query.trim())) {
        params.set("unit_size", query.trim());
      } else {
        params.set("type", query.trim());
      }
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    setSearchParams(params);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  // Handle items per page change
  const handlePerPageChange = (perPage) => {
    console.log("Items per page changed to:", perPage);
  };

  // Extract pagination info from API response
  const paginationInfo = data?.data || {};
  const predictions = paginationInfo.results || [];

  // ✅ currentPage and pageSize defined AFTER predictions
  const currentPage = parseInt(page) || 1;

  // Dynamically determine page size only from page 1 to avoid last-page miscalculation
  const pageSize =
    currentPage === 1 && predictions.length > 0
      ? predictions.length
      : parseInt(searchParams.get("page_size") || "0") || 20;

  // Save page size to URL when on page 1 so it persists across pages
  if (currentPage === 1 && predictions.length > 0) {
    const params = new URLSearchParams(searchParams);
    params.set("page_size", predictions.length.toString());
    if (searchParams.get("page_size") !== predictions.length.toString()) {
      setSearchParams(params, { replace: true });
    }
  }

  const totalPages = Math.ceil(paginationInfo.count / pageSize) || 1;

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="top">
      <div
        className={`rounded-xl font-primary shadow-sm border transition-colors duration-300 w-full mb-5 ${
          theme === "dark"
            ? "bg-[#021716] border-mediumBlack"
            : "bg-white border-lightestGrey"
        } `}
      >
        <div className="p-4">
          <SearchField
            onSearch={handleSearch}
            defaultValue={searchQuery || status || unitSize || type}
            placeholder="Search by status (Win/Loss), unit size (any number), or type..."
          />
        </div>
      </div>

      <div
        className={`rounded-xl font-primary sm:p-5 p-3 shadow-sm border transition-colors duration-300 w-full ${
          theme === "dark"
            ? "bg-[#021716] border-mediumBlack"
            : "bg-white border-lightestGrey"
        } `}
      >
        {error ? (
          <div className="flex justify-center items-center h-64">
            <CommonParagraph className="text-rose-600">
              Error: {error.message}
            </CommonParagraph>
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <CommonParagraph>No predictions found</CommonParagraph>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {predictions.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-row sm:p-5 p-2 rounded-xl transition-all duration-200 gap-5 w-full ${
                    theme === "dark" ? "bg-[#020C0B]" : "bg-lightestGrey"
                  }`}
                >
                  {/* Left section */}
                  <div className="flex justify-start items-center md:gap-3 gap-1 w-full">
                    {/* Team logo */}
                    <div
                      className={`xl:min-w-12 xl:w-12 xl:h-12 md:min-w-10 md:w-10 md:h-10 min-w-8 w-8 h-8 rounded-full flex items-center justify-center border-1 mt-1.5 ${
                        theme === "dark"
                          ? "border-lightBlack"
                          : "border-lighterGrey"
                      }`}
                    >
                      {item?.image ? (
                        <img
                          src={item.image}
                          alt={item.game}
                          className="w-full h-full rounded-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xl">
                          {item?.game?.[0]?.toUpperCase() || ""}
                        </div>
                      )}
                    </div>

                    {/* Game info */}
                    <div className="flex flex-row items-center justify-between gap-1 w-full">
                      {/* Left: Bet info */}
                      <div className="w-full">
                        <CommonParagraph
                          className={`font-semibold text-left capitalize ${
                            theme === "dark" ? "text-white" : "text-mediumBlack"
                          }`}
                        >
                          {item?.prediction_desc}
                        </CommonParagraph>
                        <div
                          className={`flex items-start gap-1 mt-1 ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          <div className="flex items-center">
                            <BsLightningChargeFill className="text-xs font-logo text-yellow-500" />
                            <CommonParagraph
                              variant="smaller"
                              className="ms-1 uppercase"
                            >
                              {item?.game}
                            </CommonParagraph>
                          </div>

                          <div className="flex items-center">
                            <FaRegClock className="text-xs" />
                            <CommonParagraph
                              variant="smaller"
                              className="ms-1 font-logo"
                            >
                              {formatDate(item?.date_time)}
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-1/2 w-[60px] flex lg:flex-row flex-col justify-between lg:items-center items-end gap-1">
                        <div className="lg:text-right lg:hidden flex lg:items-end lg:justify-end justify-center items-center xl:w-[200px] lg:w-[20px] w-full">
                          <CommonParagraph
                            variant="special"
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-darkBlack"
                            }`}
                          >
                            {item?.unit_size}%
                          </CommonParagraph>
                        </div>

                        <div className="lg:text-right lg:hidden flex lg:items-end lg:justify-end justify-center items-center xl:w-[200px] lg:w-[20px] w-full">
                          <span
                            className={`px-2 py-0.5 font-logo rounded font-medium md:text-sm text-xs border shadow-sm capitalize ${getTypeColor(
                              item?.game_status,
                            )}`}
                          >
                            {item?.game_status}
                          </span>
                        </div>

                        <div className="flex justify-center items-center xl:w-[200px] lg:w-[20px] w-full">
                          <span
                            className={`xl:text-sm md:text-xs font-logo text-[10px] font-medium text-center ${getTypeColor(
                              item?.prediction_type,
                            )}`}
                            style={{
                              color:
                                item?.prediction_type === "F"
                                  ? "#eb464c"
                                  : undefined,
                            }}
                          >
                            {item?.prediction_type || "N/A"}
                          </span>
                        </div>

                        <div className="lg:flex hidden font-logo lg:justify-center justify-end items-end lg:items-center xl:w-[200px] w-[20px]">
                          <CommonParagraph
                            variant="special"
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}
                          >
                            {item?.unit_size}%
                          </CommonParagraph>
                        </div>

                        <div className="text-right lg:flex hidden items-end justify-end xl:w-[200px] w-[20px]">
                          <span
                            className={`px-2 py-0.5 rounded font-medium md:text-sm text-xs border shadow-sm capitalize ${getTypeColor(
                              item?.game_status,
                            )}`}
                          >
                            {item?.game_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                currentPerPage={pageSize}
                onPerPageChange={handlePerPageChange}
                hasNext={!!paginationInfo.next}
                hasPrev={!!paginationInfo.previous}
              />
            </div>
          </>
        )}
      </div>
    </CommonWrapper>
  );
};

export default AllPastPrediction;
