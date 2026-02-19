import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "tt_wrapped_2025_seen";

const NewYearPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const handleViewWrapped = () => {
    closePopup();
    window.location.href = "/wrapped";
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-[#0f172a] border border-white/10 shadow-xl"
          >
            {/* Close */}
            <button
              onClick={closePopup}
              className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition"
            >
              ✕
            </button>

            {/* Content */}
            <div className="px-8 py-12 text-center">
              <div className="text-6xl mb-6">🎉</div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
                Happy New Year!
              </h2>

              <div className="flex flex-col gap-3 mt-5 lg:mt-10">
                <button
                  onClick={handleViewWrapped}
                  className="w-full sm:w-auto px-4 py-2 lg:px-10 lg:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm lg:text-lg transition-transform hover:scale-105 active:scale-95"
                >
                  View Our 2025 Wrapped!
                </button>

                <a
                  href="#"
                  className="text-blue-400 text-[10px] lg:text-md cursor-pointer"
                >
                  We should also send an email with a template that’s purely
                  tech takes wrapped
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewYearPopup;
