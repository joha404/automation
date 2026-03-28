import { useEffect, useState } from "react";

export const useSlotLayout = () => {
  const [layout, setLayout] = useState({
    itemH: 72,
    width: 96,
    height: 216,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      // 📱 Mobile (perfect fit)
      if (w < 480) {
        setLayout({
          itemH: 68,
          width: 92,
          height: 204,
          fontSize: 10,
        });
      }
      // 📲 Tablet
      else if (w < 768) {
        setLayout({
          itemH: 78,
          width: 108,
          height: 234,
          fontSize: 17,
        });
      }
      // 💻 Desktop
      else {
        setLayout({
          itemH: 90,
          width: 120,
          height: 270,
          fontSize: 20,
        });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
};
