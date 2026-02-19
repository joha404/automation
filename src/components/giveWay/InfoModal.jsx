import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import ReactDOM from "react-dom";

export default function InfoModal({
  prize_amount,
  colors,
  description,
  mutedTextClass,
  rules,
  setShowInfoModal,
  textClass,
  theme,
  title,
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      setShowInfoModal(false);
    }
  };

  // Handle close button click
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfoModal(false);
  };

  // Render modal in a portal to body
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 lg:p-6"
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Container */}
      <div
        className={`relative max-w-4xl w-full max-h-[90vh] rounded-3xl  overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-darkBlack to-darkBlack/95 border border-mediumBlack/50"
            : "bg-gradient-to-br from-white to-gray-50 border border-gray-200/50"
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div
          className={`sticky top-0 z-10 px-4 sm:px-6 lg:px-8 pt-5 lg:pt-6 pb-0 lg:pb-4 ${
            theme === "dark" ? "bg-darkBlack/95" : "bg-white/95"
          } backdrop-blur-lg border-b ${
            theme === "dark" ? "border-mediumBlack/50" : "border-gray-200/50"
          }`}
        >
          <div className="flex items-start justify-between gap-2 lg:gap-4">
            <div className="flex-1 text-center ">
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colors.amount} mb-1`}
              >
                {title}
              </h2>
              {prize_amount && (
                <p
                  className={`text-lg sm:text-xl font-semibold ${colors.info} opacity-80`}
                >
                  ${prize_amount} USD
                </p>
              )}
            </div>

            {/* Close Button - Fixed position */}
            <button
              type="button"
              onClick={handleClose}
              onMouseDown={handleClose}
              className={`absolute top-0 right-1 lg:top-4 lg:right-4  cursor-pointer flex-shrink-0 p-2.5 rounded-full transition-all duration-200 z-20 ${
                theme === "dark"
                  ? "hover:bg-mediumBlack/50 active:bg-mediumBlack/70"
                  : "hover:bg-gray-200/50 active:bg-gray-300/50"
              } ${colors.info} hover:scale-110 active:scale-95 hover:rotate-90 touch-manipulation`}
              aria-label="Close modal"
            >
              <FaTimes className="text-xl sm:text-2xl pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-2 py-1 lg:px-8 lg:py-6 custom-scrollbar">
          <div className="space-y-2 lg:space-y-8">
            {/* Description Section */}
            <div>
              <div className="flex justify-center mb-0 lg:mb-3">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    theme === "dark" ? "bg-mediumBlack/30" : "bg-gray-100"
                  }`}
                >
                  <span
                    className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${mutedTextClass}`}
                  >
                    Description
                  </span>
                </div>
              </div>
              <div
              // className={`${
              //   theme === "dark" ? "bg-mediumBlack/20" : "bg-white"
              // } rounded-2xl p-1 md:p-2 lg:p-6  border ${
              //   theme === "dark"
              //     ? "border-mediumBlack/30"
              //     : "border-gray-200/50"
              // }`}
              >
                <div
                  className={`${textClass} text-[12px] sm:text-[13px] lg:text-[14px] leading-relaxed text-left html-content`}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </div>

            {/* Rules Section */}
            {rules && rules !== "No rules." && (
              <div>
                <div className="flex justify-center mb-3">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      theme === "dark" ? "bg-mediumBlack/30" : "bg-gray-100"
                    }`}
                  >
                    <span
                      className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${mutedTextClass}`}
                    >
                      Rules & Terms
                    </span>
                  </div>
                </div>
                <div
                  className={`${
                    theme === "dark" ? "bg-mediumBlack/20" : "bg-white"
                  } rounded-2xl p-4 sm:p-6 shadow-lg border ${
                    theme === "dark"
                      ? "border-mediumBlack/30"
                      : "border-gray-200/50"
                  }`}
                >
                  <div
                    className={`${textClass} text-xs sm:text-sm lg:text-base leading-relaxed text-center html-content`}
                    dangerouslySetInnerHTML={{ __html: rules }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Padding for scroll */}
          <div className="h-6" />
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === "dark"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.2)"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === "dark"
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.3)"};
        }

        .html-content h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        .html-content h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.875rem 0;
        }
        .html-content h3 {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0.75rem 0;
        }
        .html-content p {
          margin: 0.5rem 0;
        }
        .html-content ul,
        .html-content ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          text-align: left;
        }
        .html-content li {
          margin: 0.25rem 0;
        }
        .html-content br {
          display: block;
          content: "";
          margin: 0.5rem 0;
        }
        .html-content strong,
        .html-content b {
          font-weight: bold;
        }
        .html-content em,
        .html-content i {
          font-style: italic;
        }
        .html-content a {
          text-decoration: underline;
          opacity: 0.8;
        }
        .html-content a:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );

  // Render in portal to avoid event bubbling issues
  return ReactDOM.createPortal(modalContent, document.body);
}
