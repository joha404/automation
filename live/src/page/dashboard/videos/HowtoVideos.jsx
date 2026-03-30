import React, { useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import { useTheme } from "@/hooks/custom/useTheme";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import imageOne from "../../../assets/dashboard/t1.png";
import imageTwo from "../../../assets/dashboard/t2.png";
import imageThree from "../../../assets/dashboard/t3.png";

const HowtoVideos = () => {
  const { theme } = useTheme();
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);

  const { data: response, isLoading } = useGet("/videos/", {
    queryKey: ["howto-videos"],
    secure: true,
  });

  const videos = response?.data || [];

  const thumbnailImages = [imageOne, imageTwo, imageThree];
  const getThumbnail = (video, index) => {
    if (video?.thumbnail) return video.thumbnail;
    return thumbnailImages[index % thumbnailImages.length];
  };

  const handleCardClick = (e, videoLink) => {
    if (e.target.closest(".play-btn")) return;
    window.open(videoLink, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
              onClick={(e) => handleCardClick(e, video.link)}
            >
              <div
                className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  theme === "dark"
                    ? "bg-[#1a1a1a] border border-[#2a2a2a]"
                    : "bg-white border border-gray-200"
                }`}
              >
                {/* Video Thumbnail Container */}
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  {playingVideo === video.id ? (
                    <div className="absolute inset-0">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`${video.link.replace(
                          "watch?v=",
                          "embed/"
                        )}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      <img
                        src={getThumbnail(video, index)}
                        alt={video?.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = thumbnailImages[0];
                        }}
                      />
                      <div
                        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                          hoveredVideo === video.id
                            ? "opacity-40"
                            : "opacity-20"
                        }`}
                      />

                      <div
                        className="play-btn absolute inset-0 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideo(video.id);
                        }}
                      >
                        <div
                          className={`bg-white rounded-full p-5 shadow-xl transition-all duration-300 ${
                            hoveredVideo === video.id
                              ? "scale-110 shadow-2xl"
                              : "scale-100"
                          }`}
                        >
                          <FaPlay className="w-6 h-6 text-blue-600 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3
                    className={`text-lg font-semibold mb-2 line-clamp-2 ${
                      theme === "dark"
                        ? "text-white group-hover:text-blue-400"
                        : "text-gray-900 group-hover:text-blue-600"
                    }`}
                  >
                    {video.title}
                  </h3>

                  <div
                    className={`text-sm line-clamp-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                    dangerouslySetInnerHTML={{ __html: video.description }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setModalVideo(null)}
        >
          <div
            className={`max-w-4xl w-full rounded-xl p-6 shadow-2xl ${
              theme === "dark"
                ? "bg-[#1a1a1a] text-gray-300"
                : "bg-white text-gray-600"
            } relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalVideo(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <h2
              className={`text-2xl font-bold mb-4 pr-10 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {modalVideo.title}
            </h2>

            <div
              className="text-sm leading-relaxed max-h-96 overflow-y-auto pr-2"
              dangerouslySetInnerHTML={{ __html: modalVideo.description }}
            />
          </div>
        </div>
      )}
    </CommonWrapper>
  );
};

export default HowtoVideos;
