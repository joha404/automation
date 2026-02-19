import React, { useState, useEffect } from "react";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { Link } from "react-router-dom";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const Scoreboard = () => {
  const { theme } = useTheme();
  const [showAllGames, setShowAllGames] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [displayCount, setDisplayCount] = useState(2); // Default to mobile count

  const { data: response, isLoading } = useGet("/game-score/", {
    queryKey: ["game-score"],
    secure: true,
  });

  // Use API data directly
  const games = response?.data || [];

  // Check screen size and update display count
  useEffect(() => {
    const checkScreenSize = () => {
      const largeScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largeScreen);
      setDisplayCount(largeScreen ? 4 : 1);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Check if game should be clickable (not scheduled)
  const isGameClickable = (game) => {
    return game.status?.toLowerCase() !== "scheduled";
  };

  // Calculate games to display including placeholders
  const getDisplayedGamesWithPlaceholders = () => {
    if (showAllGames) {
      // When showing all games, ensure we have multiples of 4 for large screens, 2 for small
      const targetCount = isLargeScreen ? 
        Math.ceil(games.length / 4) * 4 : 
        Math.ceil(games.length / 2) * 2;
      
      const placeholdersNeeded = Math.max(0, targetCount - games.length);
      return [...games, ...Array(placeholdersNeeded).fill(null)];
    }

    // When not showing all games, show exactly displayCount items (with placeholders if needed)
    const gamesToShow = games.slice(0, displayCount);
    const placeholdersNeeded = Math.max(0, displayCount - gamesToShow.length);
    return [...gamesToShow, ...Array(placeholdersNeeded).fill(null)];
  };

  // Games to display with placeholders
  const displayedItems = getDisplayedGamesWithPlaceholders();

  // Show button when there are more games than current display count
  const shouldShowButton = games.length > displayCount;

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
          {/* Game Cards and Placeholders */}
          {displayedItems.map((item, index) => {
            // If it's a placeholder, render "Coming Soon" card
            if (item === null) {
              return (
                <div
                  key={`placeholder-${index}`}
                  className={`border ${
                    theme === "dark"
                      ? "bg-darkBlack border-lightBlack/50"
                      : "bg-white border-lighterGrey"
                  } rounded-2xl p-6 transition-all duration-300 flex flex-col min-h-[280px] items-center justify-center`}
                >
                  <CommonParagraph
                    variant="heading"
                    className={`font-bold text-2xl text-center ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Coming Soon
                  </CommonParagraph>
                  <CommonParagraph
                    variant="small"
                    className={`text-center mt-2 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    
                  </CommonParagraph>
                </div>
              );
            }

            const game = item;
            const clickable = isGameClickable(game);
            const CardContent = (
              <div
                className={`border ${
                  theme === "dark"
                    ? "bg-darkBlack border-lightBlack/50 hover:border-darkerGrey"
                    : "bg-white border-lighterGrey hover:border-lightGrey"
                } rounded-2xl p-6 transition-all duration-300 flex flex-col min-h-[280px] ${
                  clickable
                    ? "cursor-pointer hover:shadow-2xl"
                    : "cursor-default"
                }`}
              >
                {/* Header with Timer and Status */}
                <div className="flex justify-between items-center mb-6">
                  <CommonParagraph
                    variant="smaller"
                    className="font-normal opacity-70 capitalize"
                  >
                    {game.date}
                  </CommonParagraph>

                  <CommonParagraph
                    variant="smaller"
                    className={`px-2 py-1 rounded capitalize ${
                      game.status?.toLowerCase() === "scheduled"
                        ? "text-green-200 bg-green-800"
                        : "text-blue-200 bg-blue-800"
                    }`}
                  >
                    {game.status}
                  </CommonParagraph>
                </div>

                {/* Teams Container */}
                <div className="flex flex-col space-y-4 flex-grow justify-center">
                  {/* Away Team Row */}
                  <div
                    className={`flex items-center justify-between ${
                      theme === "dark" ? "bg-lightBlack/20" : "bg-lightestBlue"
                    } rounded-xl p-4 transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {game.away_logo ? (
                        <img
                          src={game.away_logo}
                          alt={game.away_team}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                        } ${game.away_logo ? "hidden" : "flex"}`}
                      >
                        <CommonParagraph
                          variant="small"
                          className="font-semibold"
                        >
                          {game.away_team?.charAt(0)?.toUpperCase() || "A"}
                        </CommonParagraph>
                      </div>
                      <CommonParagraph
                        variant="base"
                        className="font-semibold capitalize"
                      >
                        {game.away_team}
                      </CommonParagraph>
                    </div>
                    <CommonParagraph
                      variant="heading"
                      className="font-bold text-3xl"
                    >
                      {game.away_score !== undefined && game.away_score !== null
                        ? game.away_score
                        : "- -"}
                    </CommonParagraph>
                  </div>

                  {/* Home Team Row */}
                  <div
                    className={`flex items-center justify-between ${
                      theme === "dark" ? "bg-lightBlack/20" : "bg-lightestBlue"
                    } rounded-xl p-4 transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {game.home_logo ? (
                        <img
                          src={game.home_logo}
                          alt={game.home_team}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                        } ${game.home_logo ? "hidden" : "flex"}`}
                      >
                        <CommonParagraph
                          variant="small"
                          className="font-semibold"
                        >
                          {game.home_team?.charAt(0)?.toUpperCase() || "H"}
                        </CommonParagraph>
                      </div>
                      <CommonParagraph
                        variant="base"
                        className="font-semibold capitalize"
                      >
                        {game.home_team}
                      </CommonParagraph>
                    </div>
                    <CommonParagraph
                      variant="heading"
                      className="font-bold text-3xl"
                    >
                      {game.home_score !== undefined && game.home_score !== null
                        ? game.home_score
                        : "- -"}
                    </CommonParagraph>
                  </div>
                </div>
              </div>
            );

            return clickable ? (
              <Link
                to={`/dashboard/sports-hub/scoring-summary/${game.game_type}/${game.game_id}`}
                key={game.game_id}
              >
                {CardContent}
              </Link>
            ) : (
              <div key={game.game_id}>{CardContent}</div>
            );
          })}
        </div>

        {/* Show More/Less Button - Show when there are more games than current display count */}
        {shouldShowButton && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAllGames(!showAllGames)}
              className={`px-6 py-3 rounded-lg border ${
                theme === "dark"
                  ? "bg-mediumBlack border-darkerGrey hover:bg-darkBlack"
                  : "bg-gray-50 border-lightGrey hover:bg-white"
              } transition-all duration-300`}
            >
              <CommonParagraph variant="small" className="font-semibold">
                {showAllGames
                  ? "Show Less"
                  : `Show More (+${games.length - displayCount})`}
              </CommonParagraph>
            </button>
          </div>
        )}
      </div>
    </CommonWrapper>
  );
};

export default Scoreboard;