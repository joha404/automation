// src/hooks/useMetaPixel.js
import { useEffect, useRef } from "react";

const PIXEL_ID = "1337742574731267";

const useMetaPixel = () => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    // If pixel already exists (loaded elsewhere)
    if (window.fbq) {
      console.log("✅ Meta Pixel already available");
      hasInitialized.current = true;
      return;
    }

    try {
      console.log("🔄 Loading Meta Pixel script (manual mode)...");

      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );

      setTimeout(() => {
        if (window.fbq) {
          window.fbq("init", PIXEL_ID);

          // ❌ NO auto PageView
          console.log("✅ Meta Pixel initialized (manual events only)");
          hasInitialized.current = true;
        }
      }, 500);
    } catch (err) {
      console.error("❌ Meta Pixel init failed:", err);
    }
  }, []);
};

export default useMetaPixel;
