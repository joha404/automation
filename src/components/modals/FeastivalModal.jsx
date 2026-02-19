import { getBanner } from "@/api/banner/banner.api";
import { useTheme } from "@/hooks/custom/useTheme";
import React, { useEffect, useRef, useState } from "react";
import "./feastivalModal.css";

const RollingBanner = () => {
  const { theme } = useTheme();
  const [bannerMessage, setBannerMessage] = useState(
    "Welcome to TechTakes Dashboard! Stay tuned for the latest updates and features."
  );
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const fetchBannerMessage = async () => {
      try {
        const res = await getBanner();
        if (res?.data?.text?.trim()) {
          setBannerMessage(res.data.text);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBannerMessage();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    track.innerHTML = "";

    const span = document.createElement("span");
    span.className = "marquee-text";
    span.innerText = bannerMessage;
    track.appendChild(span);

    let totalWidth = span.offsetWidth;
    const containerWidth = container.offsetWidth;

    // ✅ Only fill what is needed (+ small buffer)
    while (totalWidth < containerWidth + span.offsetWidth) {
      const clone = span.cloneNode(true);
      track.appendChild(clone);
      totalWidth += clone.offsetWidth;
    }

    const speed = 40; // slow & readable
    const duration = totalWidth / speed;

    track.style.setProperty("--marquee-width", `${totalWidth}px`);
    track.style.setProperty("--marquee-duration", `${duration}s`);
  }, [bannerMessage]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 border-b backdrop-blur-md ${
          theme === "dark"
            ? "bg-darkerBlack/95 border-gray-800"
            : "bg-lightestGrey/95 border-gray-300"
        }`}
        style={{ height: "56px" }} // slightly smaller for mobile
      >
        <div ref={containerRef} className="marquee-container">
          <div ref={trackRef} className="marquee-track" />
        </div>
      </div>

      <div style={{ height: "56px" }} />
    </>
  );
};

export default RollingBanner;
