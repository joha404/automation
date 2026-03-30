import { useTheme } from "@/hooks/custom/useTheme";
import React, { useEffect, useRef } from "react";
import "./feastivalModal.css";

const RollingBanner = ({ bannerMessage }) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const normalizedBannerMessage =
    typeof bannerMessage === "string" ? bannerMessage.trim() : "";

  useEffect(() => {
    if (
      !normalizedBannerMessage ||
      !containerRef.current ||
      !trackRef.current
    ) {
      return;
    }

    const track = trackRef.current;
    track.innerHTML = "";

    const text = normalizedBannerMessage;

    const createTextSpan = () => {
      const span = document.createElement("span");
      span.className = "marquee-text";
      span.innerText = text;
      return span;
    };

    const firstSpan = createTextSpan();
    track.appendChild(firstSpan);

    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = firstSpan.offsetWidth;
    if (!textWidth) return;

    const clonesNeeded = Math.ceil(containerWidth / textWidth) + 1;

    for (let i = 0; i < clonesNeeded; i++) {
      track.appendChild(createTextSpan());
    }

    for (let i = 0; i < clonesNeeded + 1; i++) {
      track.appendChild(createTextSpan());
    }

    const firstSetWidth = (clonesNeeded + 1) * textWidth;
    const speed = 50;
    const duration = firstSetWidth / speed;

    track.style.setProperty("--marquee-duration", `${duration}s`);
  }, [normalizedBannerMessage]);

  if (!normalizedBannerMessage) return null;

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 border-b backdrop-blur-md ${theme} ${
          theme === "dark"
            ? "bg-darkerBlack/95 border-gray-800"
            : "bg-lightestGrey/95 border-gray-300"
        }`}
        style={{ height: "56px" }}
      >
        <div ref={containerRef} className="marquee-container">
          <div ref={trackRef} className="marquee-track" />
        </div>
      </div>
      <div style={{ height: "40px" }} />
    </>
  );
};

export default RollingBanner;
