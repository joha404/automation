import CommonParagraph from "@/components/texts/CommonParagraph";
import { useGet } from "@/hooks/api/common/useGet";
import { useTheme } from "@/hooks/custom/useTheme";
import React, { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Chatroom from "./Chatroom";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const ScoreDetails = () => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const params = useParams();
  console.log(params);

  // Fetch game details
  const {
    data: response,
    isLoading,
    error,
  } = useGet(`/game/${params.game_type}/${params.id}`, {
    queryKey: ["live-score-details", params.id],
    secure: true,
  });

  const game = response?.data;
  const isAmericanFootball =
    params?.game_type === "american_football" || params?.game_type === "ncaa";
  const isBasketball = params?.game_type === "basketball";
  const isBaseball = params?.game_type === "baseball";
  const isHockey = params?.game_type === "hockey";
  const isSoccer = params?.game_type === "soccer";
  const isRugby = params?.game_type === "rugby";
  const isUfc = params?.game_type === "ufc";

  // Function to parse field goals and calculate percentage
  const parseFieldGoals = (fieldGoals) => {
    if (!fieldGoals) return { percentage: 0, display: "0%" };

    // If it's already a number, assume it's percentage
    if (typeof fieldGoals === "number") {
      return {
        percentage: fieldGoals,
        display: `${fieldGoals}%`,
      };
    }

    // If it's a string like "33/80"
    if (typeof fieldGoals === "string") {
      const parts = fieldGoals.split("/");
      if (parts.length === 2) {
        const made = parseFloat(parts[0]) || 0;
        const attempted = parseFloat(parts[1]) || 0;
        const percentage =
          attempted > 0 ? Math.round((made / attempted) * 100) : 0;

        return {
          percentage,
          display: `${percentage}%`,
        };
      }

      // If it's just a number string, assume percentage
      const numValue = parseFloat(fieldGoals);
      if (!isNaN(numValue)) {
        return {
          percentage: numValue,
          display: `${numValue}%`,
        };
      }
    }

    return { percentage: 0, display: "0%" };
  };

  // Parse field goals for both teams
  const awayFieldGoals = parseFieldGoals(game?.away_field_goals);
  const homeFieldGoals = parseFieldGoals(game?.home_field_goals);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  // Error state or no game data
  if (error || !game) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center items-center min-h-64">
        <div
          className={`text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <CommonParagraph variant="large" className="mb-2">
            Unable to load game details
          </CommonParagraph>
          <CommonParagraph variant="small">
            {error ? error.message : "Game data not available"}
          </CommonParagraph>
        </div>
      </div>
    );
  }

  const hasLiveLink = game.live_link && game.live_link !== "";

  return (
    <div
      className={`min-h-screen font-primary ${
        theme === "dark"
          ? "bg-darkerBlack text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <main className="flex-1">
        <div className="lg:p-6 ">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Game Details</h1>
              <CommonParagraph
                variant="small"
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {game.home_team} vs {game.away_team}
              </CommonParagraph>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-mediumBlue/10 border border-mediumBlue/30">
              <div className="w-2 h-2 bg-mediumBlue rounded-full animate-pulse"></div>
              <CommonParagraph
                variant="smaller"
                className="font-semibold uppercase tracking-wider text-mediumBlue"
              >
                {game?.status}
              </CommonParagraph>
            </div>
          </div>

          {/* Team Score Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Away Team Card */}
            <div
              className={`rounded-2xl p-6 border ${
                theme === "dark"
                  ? "bg-darkBlack border-mediumBlack hover:border-darkerGrey"
                  : "bg-white border-gray-200 hover:border-gray-300"
              } transition-all duration-300 group hover:shadow-lg`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div
                  className={`rounded-xl p-3 ${
                    theme === "dark" ? "bg-mediumBlack" : "bg-gray-100"
                  }`}
                >
                  {game.away_logo ? (
                    <img
                      src={game.away_logo}
                      alt={game.away_team}
                      className="w-14 h-14 object-contain"
                    />
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    >
                      <CommonParagraph variant="medium" className="font-bold">
                        {game.away_team?.charAt(0)?.toUpperCase() || "A"}
                      </CommonParagraph>
                    </div>
                  )}
                </div>
                <div>
                  <CommonParagraph variant="large" className="font-bold">
                    {game.away_team}
                  </CommonParagraph>
                  <CommonParagraph
                    variant="small"
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Away Team
                  </CommonParagraph>
                </div>
              </div>

              <div className="text-6xl font-bold mb-6 text-center">
                {isBaseball ? game.away_total : game.away_points}
              </div>

              {isAmericanFootball ||
              isSoccer ||
              isRugby ||
              isHockey ||
              isUfc ? (
                <div className="space-y-4">
                  {/* Field Goals */}
                  <div className="text-6xl font-bold mb-6 text-center">
                    {isAmericanFootball || isRugby || isHockey
                      ? game.away_total
                      : game.away_goals}
                    {isUfc && game.away_score}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Field Goals */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <CommonParagraph
                        variant="small"
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {isBasketball ? "Field Goals" : "Hits"}
                      </CommonParagraph>
                      <CommonParagraph
                        variant="small"
                        className="font-semibold"
                      >
                        {isBasketball ? game.away_field_goals : game.away_hits}
                      </CommonParagraph>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Progress Bar Container - 3/5 width */}
                      {isBasketball && (
                        <div
                          className={`lg:w-3/5 w-full rounded-full h-2 ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                awayFieldGoals.percentage,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3PT & FT */}
                  <div className="flex justify-between items-center">
                    <CommonParagraph
                      variant="small"
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      {isBasketball ? "3PT · FT" : "Errors"}
                    </CommonParagraph>
                    <CommonParagraph variant="small" className="font-semibold">
                      {isBasketball ? game.away_3PT_FT : game.away_errors}
                    </CommonParagraph>
                  </div>
                </div>
              )}
            </div>

            {/* Home Team Card */}
            <div
              className={`rounded-2xl p-6 border ${
                theme === "dark"
                  ? "bg-darkBlack border-mediumBlack hover:border-darkerGrey"
                  : "bg-white border-gray-200 hover:border-gray-300"
              } transition-all duration-300 group hover:shadow-lg`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div
                  className={`rounded-xl p-3 ${
                    theme === "dark" ? "bg-mediumBlack" : "bg-gray-100"
                  }`}
                >
                  {game.home_logo ? (
                    <img
                      src={game.home_logo}
                      alt={game.home_team}
                      className="w-14 h-14 object-contain"
                    />
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    >
                      <CommonParagraph variant="medium" className="font-bold">
                        {game.home_team?.charAt(0)?.toUpperCase() || "H"}
                      </CommonParagraph>
                    </div>
                  )}
                </div>
                <div>
                  <CommonParagraph variant="large" className="font-bold">
                    {game.home_team}
                  </CommonParagraph>
                  <CommonParagraph
                    variant="small"
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Home Team
                  </CommonParagraph>
                </div>
              </div>

              <div className="text-6xl font-bold mb-6 text-center">
                {isBaseball ? game.home_total : game.home_points}
              </div>

              {isAmericanFootball ||
              isSoccer ||
              isRugby ||
              isHockey ||
              isUfc ? (
                <div className="space-y-4">
                  {/* Field Goals */}
                  <div className="text-6xl font-bold mb-6 text-center">
                    {isAmericanFootball || isRugby || isHockey
                      ? game.home_total
                      : game.home_goals}

                    {isUfc && game.home_score}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Field Goals */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <CommonParagraph
                        variant="small"
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {isBasketball ? "Field Goals" : "Hits"}
                      </CommonParagraph>
                      <CommonParagraph
                        variant="small"
                        className="font-semibold"
                      >
                        {isBasketball ? game.home_field_goals : game.home_hits}
                      </CommonParagraph>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Progress Bar Container - 3/5 width */}
                      {isBasketball && (
                        <div
                          className={`md:w-3/5 w-full rounded-full h-2 ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                homeFieldGoals.percentage,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3PT & FT */}
                  <div className="flex justify-between items-center">
                    <CommonParagraph
                      variant="small"
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      {isBasketball ? "3PT · FT" : "Errors"}
                    </CommonParagraph>
                    <CommonParagraph variant="small" className="font-semibold">
                      {isBasketball ? game.home_3PT_FT : game.home_errors}
                    </CommonParagraph>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          {isBasketball && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Assists", value: game.assists },
                { label: "Rebounds", value: game.rebounds },
                { label: "Turnovers", value: game.turnovers },
                { label: "Blocks", value: game.blocks },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 border ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack hover:border-darkerGrey"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  } transition-all duration-300 group hover:shadow-md`}
                >
                  <CommonParagraph
                    variant="smaller"
                    className={`uppercase tracking-wider mb-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </CommonParagraph>
                  <CommonParagraph
                    variant="large"
                    className={`font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </CommonParagraph>
                </div>
              ))}
            </div>
          )}

          {/* Soccer Stats Grid */}
          {isSoccer && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Halftime",
                  value: `${game.halftime?.away || 0} - ${
                    game.halftime?.home || 0
                  }`,
                },
                {
                  label: "Fulltime",
                  value: `${game.fulltime?.away || 0} - ${
                    game.fulltime?.home || 0
                  }`,
                },
                {
                  label: "Extratime",
                  value:
                    game.extratime?.home !== null &&
                    game.extratime?.away !== null
                      ? `${game.extratime.away} - ${game.extratime.home}`
                      : "N/A",
                },
                {
                  label: "Penalties",
                  value:
                    game.penalties?.home !== null &&
                    game.penalties?.away !== null
                      ? `${game.penalties.away} - ${game.penalties.home}`
                      : "N/A",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 border ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack hover:border-darkerGrey"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  } transition-all duration-300 group hover:shadow-md`}
                >
                  <CommonParagraph
                    variant="smaller"
                    className={`uppercase tracking-wider mb-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </CommonParagraph>
                  <CommonParagraph
                    variant="large"
                    className={`font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </CommonParagraph>
                </div>
              ))}
            </div>
          )}

          {/* Rugby Stats Grid */}
          {isRugby && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {game.periods?.map((period, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 border ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack hover:border-darkerGrey"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  } transition-all duration-300 group hover:shadow-md`}
                >
                  <CommonParagraph
                    variant="smaller"
                    className={`uppercase tracking-wider mb-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {period.period === "first"
                      ? "First Half"
                      : period.period === "second"
                      ? "Second Half"
                      : period.period === "overtime"
                      ? "Overtime"
                      : period.period === "second_overtime"
                      ? "2nd Overtime"
                      : period.period}
                  </CommonParagraph>
                  <CommonParagraph
                    variant="large"
                    className={`font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {period.home !== null && period.away !== null
                      ? `${period.away}-${period.home}`
                      : "N/A"}
                  </CommonParagraph>
                </div>
              ))}
            </div>
          )}

          {/* Video + Chat */}
          {hasLiveLink ? (
            <div className="grid grid-cols-1 xlg:grid-cols-7 gap-6 mb-8 ">
              {/* Video */}
              <div
                className={`xlg:col-span-4 rounded-2xl overflow-hidden ${
                  theme === "dark" ? "bg-darkBlack" : "bg-white"
                } border ${
                  theme === "dark" ? "border-mediumBlack" : "border-gray-200"
                }`}
              >
                <div className="relative aspect-video h-[600px]">
                  <iframe
                    src={game.live_link}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Game Live Stream"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-md">
                    <CommonParagraph
                      variant="smaller"
                      className="font-semibold"
                    >
                      Live
                    </CommonParagraph>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  >
                    {isPlaying ? (
                      <FaPause className="w-5 h-5" />
                    ) : (
                      <FaPlay className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Chat */}
              <div className="xlg:col-span-3">
                <Chatroom />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xlg:grid-cols-7 gap-5 mb-8">
              <div
                className={`h-[550px] w-full xlg:col-span-4 rounded-2xl overflow-hidden aspect-video flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-darkBlack border border-mediumBlack"
                    : "bg-white border border-gray-200"
                }`}
              >
                <CommonParagraph
                  variant="large"
                  className="opacity-80 text-wrap text-center"
                >
                  Live Stream Coming Soon
                </CommonParagraph>
              </div>
              <div className="xlg:col-span-3">
                <Chatroom />
              </div>
            </div>
          )}

          {isHockey && (
            <div className="w-full overflow-x-auto">
              <div
                className={`rounded-2xl min-w-full inline-block ${
                  theme === "dark"
                    ? "bg-darkBlack border border-mediumBlack"
                    : "bg-white border border-gray-200"
                }`}
              >
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr
                      className={`${
                        theme === "dark"
                          ? "border-b border-mediumBlack"
                          : "border-b border-gray-200"
                      }`}
                    >
                      <th className="text-left py-4 px-6">
                        <CommonParagraph
                          variant="smaller"
                          className="font-semibold uppercase tracking-wider opacity-60"
                        >
                          Team
                        </CommonParagraph>
                      </th>

                      {/* Hockey Headers - Periods */}
                      {game.periods?.map((period) => (
                        <th
                          key={period.periods}
                          className="text-center py-4 px-3"
                        >
                          <CommonParagraph
                            variant="smaller"
                            className="font-semibold uppercase tracking-wider opacity-60"
                          >
                            {period.periods === "OT"
                              ? "OT"
                              : `P${period.periods}`}
                          </CommonParagraph>
                        </th>
                      ))}
                      <th className="text-center py-4 px-3">
                        <CommonParagraph
                          variant="smaller"
                          className="font-semibold uppercase tracking-wider opacity-60"
                        >
                          Total
                        </CommonParagraph>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Away Team Row */}
                    <tr
                      className={`${
                        theme === "dark"
                          ? "border-b border-mediumBlack hover:bg-gray-900"
                          : "border-b border-gray-100 hover:bg-gray-50"
                      } transition-colors duration-200`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {game.away_logo ? (
                            <img
                              src={game.away_logo}
                              alt={game.away_team}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                theme === "dark" ? "bg-red-600" : "bg-red-500"
                              }`}
                            >
                              <CommonParagraph variant="smaller">
                                {game.away_team?.charAt(0) || "A"}
                              </CommonParagraph>
                            </div>
                          )}
                          <CommonParagraph
                            variant="small"
                            className="font-semibold"
                          >
                            {game.away_team}
                          </CommonParagraph>
                        </div>
                      </td>
                      {game.periods?.map((period) => (
                        <td
                          key={period.periods}
                          className="text-center py-4 px-3"
                        >
                          <CommonParagraph
                            variant="small"
                            className="font-medium"
                          >
                            {period.away ?? "-"}
                          </CommonParagraph>
                        </td>
                      ))}
                      <td className="text-center py-4 px-3">
                        <CommonParagraph
                          variant="small"
                          className="font-medium font-bold"
                        >
                          {game.away_total}
                        </CommonParagraph>
                      </td>
                    </tr>

                    {/* Home Team Row */}
                    <tr
                      className={`${
                        theme === "dark"
                          ? "hover:bg-gray-900"
                          : "hover:bg-gray-50"
                      } transition-colors duration-200`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {game.home_logo ? (
                            <img
                              src={game.home_logo}
                              alt={game.home_team}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                theme === "dark" ? "bg-blue-600" : "bg-blue-500"
                              }`}
                            >
                              <CommonParagraph variant="smaller">
                                {game.home_team?.charAt(0) || "H"}
                              </CommonParagraph>
                            </div>
                          )}
                          <CommonParagraph
                            variant="small"
                            className="font-semibold"
                          >
                            {game.home_team}
                          </CommonParagraph>
                        </div>
                      </td>
                      {game.periods?.map((period) => (
                        <td
                          key={period.periods}
                          className="text-center py-4 px-3"
                        >
                          <CommonParagraph
                            variant="small"
                            className="font-medium"
                          >
                            {period.home ?? "-"}
                          </CommonParagraph>
                        </td>
                      ))}
                      <td className="text-center py-4 px-3">
                        <CommonParagraph
                          variant="small"
                          className="font-medium font-bold"
                        >
                          {game.home_total}
                        </CommonParagraph>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed Stats Table */}
          {(isBasketball || isAmericanFootball || isBaseball) && (
            <div className="w-full overflow-x-auto">
              <div
                className={`rounded-2xl min-w-full inline-block ${
                  theme === "dark"
                    ? "bg-darkBlack border border-mediumBlack"
                    : "bg-white border border-gray-200"
                }`}
              >
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr
                      className={`${
                        theme === "dark"
                          ? "border-b border-mediumBlack"
                          : "border-b border-gray-200"
                      }`}
                    >
                      <th className="text-left py-4 px-6">
                        <CommonParagraph
                          variant="smaller"
                          className="font-semibold uppercase tracking-wider opacity-60"
                        >
                          Team
                        </CommonParagraph>
                      </th>

                      {isAmericanFootball ? (
                        // American Football Headers - Quarters
                        <>
                          {game.quarters?.map((quarter) => (
                            <th
                              key={quarter.quarter}
                              className="text-center py-4 px-3"
                            >
                              <CommonParagraph
                                variant="smaller"
                                className="font-semibold uppercase tracking-wider opacity-60"
                              >
                                {params?.game_type === "ncaa"
                                  ? // NCAA structure 
                                    quarter.first_half
                                    ? "First Half"
                                    : quarter.second_half
                                    ? "Second Half"
                                    : quarter.over
                                    ? "OT"
                                    : "OT"
                                  : // Regular NBA structure
                                  quarter.quarter === "OT"
                                  ? "OT"
                                  : `Q${quarter.quarter}`} 
                              </CommonParagraph> 
                            </th>
                          ))}
                          <th className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="smaller"
                              className="font-semibold uppercase tracking-wider opacity-60"
                            >
                              Total
                            </CommonParagraph>
                          </th>
                        </>
                      ) : isBaseball ? (
                        // Baseball Headers - Innings
                        <>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inning) => (
                            <th key={inning} className="text-center py-4 px-2">
                              <CommonParagraph
                                variant="smaller"
                                className="font-semibold uppercase tracking-wider opacity-60"
                              >
                                {inning}
                              </CommonParagraph>
                            </th>
                          ))}
                          <th className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="smaller"
                              className="font-semibold uppercase tracking-wider opacity-60"
                            >
                              R
                            </CommonParagraph>
                          </th>
                          <th className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="smaller"
                              className="font-semibold uppercase tracking-wider opacity-60"
                            >
                              H
                            </CommonParagraph>
                          </th>
                          <th className="text-center py-4 px-2">
                            <CommonParagraph
                              variant="smaller"
                              className="font-semibold uppercase tracking-wider opacity-60"
                            >
                              E
                            </CommonParagraph>
                          </th>
                        </>
                      ) : (
                        // Basketball Headers
                        [
                          "FGM",
                          "FGA",
                          "FG%",
                          "3PM",
                          "3PA",
                          "3P%",
                          "FTM",
                          "FTA",
                          "FT%",
                          "REB",
                        ].map((header) => (
                          <th key={header} className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="smaller"
                              className="font-semibold uppercase tracking-wider opacity-60"
                            >
                              {header}
                            </CommonParagraph>
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {isAmericanFootball ? (
                      // American Football Rows
                      <>
                        {/* Away Team Row */}
                        <tr
                          className={`${
                            theme === "dark"
                              ? "border-b border-mediumBlack hover:bg-gray-900"
                              : "border-b border-gray-100 hover:bg-gray-50"
                          } transition-colors duration-200`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {game.away_logo ? (
                                <img
                                  src={game.away_logo}
                                  alt={game.away_team}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                    theme === "dark"
                                      ? "bg-red-600"
                                      : "bg-red-500"
                                  }`}
                                >
                                  <CommonParagraph variant="smaller">
                                    {game.away_team?.charAt(0) || "A"}
                                  </CommonParagraph>
                                </div>
                              )}
                              <CommonParagraph
                                variant="small"
                                className="font-semibold"
                              >
                                {game.away_team}
                              </CommonParagraph>
                            </div>
                          </td>
                          {game.quarters?.map((quarter) => (
                            <td
                              key={quarter.quarter}
                              className="text-center py-4 px-3"
                            >
                              <CommonParagraph
                                variant="small"
                                className="font-medium"
                              >
                                {quarter.away ?? "-"}
                              </CommonParagraph>
                            </td>
                          ))}
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium font-bold"
                            >
                              {game.away_total}
                            </CommonParagraph>
                          </td>
                        </tr>

                        {/* Home Team Row */}
                        <tr
                          className={`${
                            theme === "dark"
                              ? "hover:bg-gray-900"
                              : "hover:bg-gray-50"
                          } transition-colors duration-200`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {game.home_logo ? (
                                <img
                                  src={game.home_logo}
                                  alt={game.home_team}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                    theme === "dark"
                                      ? "bg-blue-600"
                                      : "bg-blue-500"
                                  }`}
                                >
                                  <CommonParagraph variant="smaller">
                                    {game.home_team?.charAt(0) || "H"}
                                  </CommonParagraph>
                                </div>
                              )}
                              <CommonParagraph
                                variant="small"
                                className="font-semibold"
                              >
                                {game.home_team}
                              </CommonParagraph>
                            </div>
                          </td>
                          {game.quarters?.map((quarter) => (
                            <td
                              key={quarter.quarter}
                              className="text-center py-4 px-3"
                            >
                              <CommonParagraph
                                variant="small"
                                className="font-medium"
                              >
                                {quarter.home ?? "-"}
                              </CommonParagraph>
                            </td>
                          ))}
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium font-bold"
                            >
                              {game.home_total}
                            </CommonParagraph>
                          </td>
                        </tr>
                      </>
                    ) : isBaseball ? (
                      // Baseball Rows
                      <>
                        {/* Away Team Row */}
                        <tr
                          className={`${
                            theme === "dark"
                              ? "border-b border-mediumBlack hover:bg-gray-900"
                              : "border-b border-gray-100 hover:bg-gray-50"
                          } transition-colors duration-200`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {game.away_logo ? (
                                <img
                                  src={game.away_logo}
                                  alt={game.away_team}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                    theme === "dark"
                                      ? "bg-red-600"
                                      : "bg-red-500"
                                  }`}
                                >
                                  <CommonParagraph variant="smaller">
                                    {game.away_team?.charAt(0) || "A"}
                                  </CommonParagraph>
                                </div>
                              )}
                              <CommonParagraph
                                variant="small"
                                className="font-semibold"
                              >
                                {game.away_team}
                              </CommonParagraph>
                            </div>
                          </td>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inning) => (
                            <td key={inning} className="text-center py-4 px-2">
                              <CommonParagraph
                                variant="small"
                                className="font-medium"
                              >
                                {game.away_scores?.[inning] ?? "-"}
                              </CommonParagraph>
                            </td>
                          ))}
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium font-bold"
                            >
                              {game.away_total}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_hits || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-2">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_errors || 0}
                            </CommonParagraph>
                          </td>
                        </tr>

                        {/* Home Team Row */}
                        <tr
                          className={`${
                            theme === "dark"
                              ? "hover:bg-gray-900"
                              : "hover:bg-gray-50"
                          } transition-colors duration-200`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {game.home_logo ? (
                                <img
                                  src={game.home_logo}
                                  alt={game.home_team}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                    theme === "dark"
                                      ? "bg-blue-600"
                                      : "bg-blue-500"
                                  }`}
                                >
                                  <CommonParagraph variant="smaller">
                                    {game.home_team?.charAt(0) || "H"}
                                  </CommonParagraph>
                                </div>
                              )}
                              <CommonParagraph
                                variant="small"
                                className="font-semibold"
                              >
                                {game.home_team}
                              </CommonParagraph>
                            </div>
                          </td>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inning) => (
                            <td key={inning} className="text-center py-4 px-2">
                              <CommonParagraph
                                variant="small"
                                className="font-medium"
                              >
                                {game.home_scores?.[inning] ?? "-"}
                              </CommonParagraph>
                            </td>
                          ))}
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium font-bold"
                            >
                              {game.home_total}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_hits || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-2">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_errors || 0}
                            </CommonParagraph>
                          </td>
                        </tr>
                      </>
                    ) : (
                      // Basketball Rows
                      <>
                        {/* Away Team Row */}
                        <tr
                          className={`${
                            theme === "dark"
                              ? "border-b border-mediumBlack hover:bg-gray-900"
                              : "border-b border-gray-100 hover:bg-gray-50"
                          } transition-colors duration-200`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {game.away_logo ? (
                                <img
                                  src={game.away_logo}
                                  alt={game.away_team}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                    theme === "dark"
                                      ? "bg-red-600"
                                      : "bg-red-500"
                                  }`}
                                >
                                  <CommonParagraph variant="smaller">
                                    {game.away_team?.charAt(0) || "A"}
                                  </CommonParagraph>
                                </div>
                              )}
                              <CommonParagraph
                                variant="small"
                                className="font-semibold"
                              >
                                {game.away_team}
                              </CommonParagraph>
                            </div>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.fgm || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.fga || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.fgp || 0}%
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.tpm || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.tpa || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.tpp || 0}%
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.ftm || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.fta || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.ftp || 0}%
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.away_detail?.reb || 0}
                            </CommonParagraph>
                          </td>
                        </tr>

                        {/* Home Team Row */}
                        <tr
                          className={`${
                            theme === "dark"
                              ? "hover:bg-gray-900"
                              : "hover:bg-gray-50"
                          } transition-colors duration-200`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {game.home_logo ? (
                                <img
                                  src={game.home_logo}
                                  alt={game.home_team}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                    theme === "dark"
                                      ? "bg-blue-600"
                                      : "bg-blue-500"
                                  }`}
                                >
                                  <CommonParagraph variant="smaller">
                                    {game.home_team?.charAt(0) || "H"}
                                  </CommonParagraph>
                                </div>
                              )}
                              <CommonParagraph
                                variant="small"
                                className="font-semibold"
                              >
                                {game.home_team}
                              </CommonParagraph>
                            </div>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.fgm || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.fga || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.fgp || 0}%
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.tpm || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.tpa || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.tpp || 0}%
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.ftm || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.fta || 0}
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.ftp || 0}%
                            </CommonParagraph>
                          </td>
                          <td className="text-center py-4 px-3">
                            <CommonParagraph
                              variant="small"
                              className="font-medium"
                            >
                              {game.home_detail?.reb || 0}
                            </CommonParagraph>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScoreDetails;
