import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // Define allowed paths
    const allowedPaths = [
      "/sign-up",
      "/success",
      "/package/success",
      "/dashboard/subscription-tiers",
    ];

    // Check if current path is allowed
    const isAllowedPath = allowedPaths.includes(location.pathname);

    if (!window.fbq) return;

    if (isAllowedPath) {
      // Track PageView only on allowed pages
      window.fbq("track", "PageView");
      console.log("✅ Meta Pixel PageView fired:", location.pathname);
    } else {
      // Explicitly disable tracking on other pages
      console.log("🚫 Meta Pixel blocked on:", location.pathname);
    }
  }, [location.pathname]);

  return null;
}
