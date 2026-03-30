import React from "react";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { Link } from "react-router-dom";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const Scoreboard = () => {
  const { theme } = useTheme();

  const { data: response, isLoading } = useGet("/game-score/", {
    queryKey: ["game-score"],
    secure: true,
  });

  // Use API data directly and ensure we have exactly 8 items (games + placeholders)
  const games = response?.data || [];
  const gamesToShow = games.slice(0, 8);
  
  // Calculate how many placeholder cards we need
  const placeholderCount = Math.max(0, 8 - gamesToShow.length);
  
  // Create array with real games followed by placeholders
  const displayItems = [...gamesToShow, ...Array(placeholderCount).fill(null)];

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  const renderGameCard = (game, isMobile = false) => {
    // If it's a placeholder, render "Coming Soon" card
    if (game === null) {
      return (
        <div
          className={`border shadow-md ${
            theme === "dark"
              ? "bg-darkerBlack border-mediumBlack"
              : "bg-lightestGrey border-lighterGrey"
          } rounded-xl px-5 ${isMobile ? 'py-0.5' : 'py-2'} transition-all duration-300 flex flex-col items-center justify-center min-h-[80px]`}
        >
          <CommonParagraph
            variant="small"
            className={`font-semibold text-center ${isMobile ? 'text-xs' : ''} ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Coming Soon
          </CommonParagraph>
          <CommonParagraph
            variant="smaller"
            className={`text-center mt-1 ${isMobile ? 'text-xs' : ''} ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
           
          </CommonParagraph>
        </div>
      );
    }
    
    return (
      <div
        className={`border shadow-md ${
          theme === "dark"
            ? "bg-darkerBlack border-mediumBlack"
            : "bg-lightestGrey border-lighterGrey"
        } rounded-xl px-5 ${isMobile ? 'py-0.5' : 'py-2'} transition-all duration-300 cursor-default`}
      >
        {/* Game Status */}
        <div className={`flex justify-between items-center ${isMobile ? '' : 'mb-2'} opacity-90`}>
          <CommonParagraph variant="smaller" className="font-normal opacity-70">
            {game.date }
          </CommonParagraph>
          <CommonParagraph
            variant="smaller"
            className={`px-2 ${isMobile ? 'py-0.5' : 'py-1'} rounded capitalize text-xs ${
              game.status?.toLowerCase() === "scheduled"
                ? "text-green-200 bg-green-800"
                : "text-blue-200 bg-blue-800"
            }`}
          >
            {game.status}
          </CommonParagraph>
        </div>

        {/* Away Team */}
        <div className={`flex items-center justify-between ${isMobile ? '' : 'mb-1'}`}>
          <div className="flex items-center space-x-3">
            {game.away_logo ? (
              <img
                src={game.away_logo}
                alt={game.away_team}
                className="w-4 h-4 rounded-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-300"
              } ${game.away_logo ? "hidden" : "flex"}`}
            >
              <CommonParagraph variant="smaller" className="text-white text-xs font-bold">
                {game.away_team?.charAt(0)?.toUpperCase() || "A"}
              </CommonParagraph>
            </div>
            <CommonParagraph variant="smaller" className="font-normal text-mediumBlue opacity-85 capitalize">
              {game.away_team}
            </CommonParagraph>
          </div>
          <CommonParagraph variant="small" className="font-bold">
            {game.away_score !== undefined && game.away_score !== null
              ? game.away_score
              : "- -"}
          </CommonParagraph>
        </div>

        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {game.home_logo ? (
              <img
                src={game.home_logo}
                alt={game.home_team}
                className="w-4 h-4 rounded-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-300"
              } ${game.home_logo ? "hidden" : "flex"}`}
            >
              <CommonParagraph variant="smaller" className="text-white text-xs font-bold">
                {game.home_team?.charAt(0)?.toUpperCase() || "H"}
              </CommonParagraph>
            </div>
            <CommonParagraph variant="smaller" className="font-normal opacity-85 capitalize">
              {game.home_team}
            </CommonParagraph>
          </div>
          <CommonParagraph variant="small" className="font-bold">
            {game.home_score !== undefined && game.home_score !== null
              ? game.home_score
              : "- -"}
          </CommonParagraph>
        </div>
      </div>
    );
  };

  return (
    <CommonWrapper variant="bottomSmall">
      <Link to={`/dashboard/sports-hub`}>
        <div
          className={`font-primary rounded-xl md:p-3 p-1 shadow-sm border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-darkBlack border-mediumBlack"
              : "bg-white border-lightestGrey"
          } `}
        >
          <CommonParagraph variant="small" className="font-semibold ">
            Scoreboard
          </CommonParagraph>
          
          {/* Desktop View - Show 8 cards in 4-column grid */}
          <div className="mx-auto lg:block hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1">
              {displayItems.map((item, index) => 
                renderGameCard(item, false)
              )}
            </div>
          </div>

          {/* Mobile View - Show only 1 card (first real game or first placeholder) */}
          <div className="mx-auto lg:hidden block">
            <div className="grid grid-cols-1">
              {renderGameCard(displayItems[0], true)}
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default Scoreboard;