import CommonParagraph from "@/components/texts/CommonParagraph";

const SummaryRow = ({ title, data, theme }) => (
  <div
    className={`grid grid-cols-4 items-center py-3 rounded px-2 ${
      theme === "dark" ? "hover:bg-[#021716]" : "hover:bg-lightestBlue"
    }`}
  >
    <CommonParagraph variant="small" className="font-medium">
      {title}
    </CommonParagraph>
    <CommonParagraph
      className={`text-center font-semibold px-2 py-2 mx-1.5 rounded whitespace-nowrap ${
        (data?.net?.toString() || "0.00").length > 6
          ? "text-[7px] xs:text-[8px] sm:text-[9px]"
          : (data?.net?.toString() || "0.00").length > 4
            ? "text-[8px] xs:text-[9px] sm:text-[10px]"
            : "text-[8px] xs:text-[9px] sm:text-xs"
      } ${
        data?.net === undefined || data?.net === null || data?.net === ""
          ? "bg-lightBlack text-white"
          : data.net < 0
            ? "bg-rose-600 text-white"
            : "bg-[#054844] text-white"
      }`}
    >
      {data?.net || "0.00"} %
    </CommonParagraph>
    <CommonParagraph className="text-center font-medium">
      {data?.win || "0.00"}
    </CommonParagraph>
    <CommonParagraph className="text-center font-medium">
      {data?.losses || "0.00"}
    </CommonParagraph>
  </div>
);

export default SummaryRow;
