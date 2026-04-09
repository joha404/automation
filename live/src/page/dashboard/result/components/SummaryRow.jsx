import CommonParagraph from "@/components/texts/CommonParagraph";
import { useRef, useEffect, useState } from "react";

const SummaryRow = ({ title, data, theme }) => {
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    if (textRef.current) {
      let currentSize = 12;
      textRef.current.style.fontSize = `${currentSize}px`;

      // Decrease font size until text fits
      while (
        textRef.current.scrollWidth > textRef.current.clientWidth &&
        currentSize > 6
      ) {
        currentSize -= 0.5;
        textRef.current.style.fontSize = `${currentSize}px`;
      }

      setFontSize(currentSize);
    }
  }, [data?.net]);

  return (
    <div
      className={`grid grid-cols-4 items-center py-3 rounded px-2 ${
        theme === "dark" ? "hover:bg-[#021716]" : "hover:bg-lightestBlue"
      }`}
    >
      <CommonParagraph variant="small" className="font-medium">
        {title}
      </CommonParagraph>
      <div
        ref={textRef}
        className={`text-center font-semibold px-2 py-2 mx-1 rounded whitespace-nowrap flex items-center justify-center ${
          data?.net === undefined || data?.net === null || data?.net === ""
            ? "bg-lightBlack text-white"
            : data.net < 0
              ? "bg-rose-600 text-white"
              : "bg-green-500 text-white"
        }`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {data?.net || "0.00"} %
      </div>
      <CommonParagraph className="text-center font-medium">
        {data?.win || "0.00"}
      </CommonParagraph>
      <CommonParagraph className="text-center font-medium">
        {data?.losses || "0.00"}
      </CommonParagraph>
    </div>
  );
};

export default SummaryRow;
