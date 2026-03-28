import { useTheme } from "@/hooks/custom/useTheme";
import CommonParagraph from "@/components/texts/CommonParagraph";

const AutomationSummaryRow = ({ title, data = {}, loading }) => {
  const { theme } = useTheme();

  // 🔹 SKELETON STATE
  if (loading) {
    return (
      <div
        className={`grid grid-cols-2 items-center gap-4 py-3 px-2 rounded ${
          theme === "dark" ? "bg-darkBlack" : "bg-white"
        }`}
      >
        {/* Timeline Skeleton */}
        <div
          className={`h-4 w-20 rounded animate-pulse ${
            theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
          }`}
        />

        {/* Amount Skeleton */}
        <div className="flex justify-center">
          <div
            className={`h-9 w-32 rounded animate-pulse ${
              theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
            }`}
          />
        </div>
      </div>
    );
  }

  // 🔹 NORMAL DATA STATE
  const net = Number(data?.amount ?? 0);
  const hasNet = data?.amount !== undefined && data?.amount !== null;

  return (
    <div
      className={`grid grid-cols-2 items-center gap-4 py-3 px-2 rounded transition ${
        theme === "dark" ? "hover:bg-mediumBlack" : "hover:bg-lightestBlue"
      }`}
    >
      {/* TIMELINE */}
      <CommonParagraph variant="small" className="font-medium">
        {title}
      </CommonParagraph>

      {/* PROFIT / LOSS */}
      <div className="flex justify-center">
        <div
          className={`text-center font-semibold px-4 py-2 rounded min-w-32 ${
            !hasNet
              ? theme === "dark"
                ? "bg-lightBlack text-lighterGrey"
                : "bg-gray-200 text-darkGrey"
              : net < 0
              ? "bg-rose-600 text-white"
              : "bg-green-700 text-white"
          }`}
        >
          <CommonParagraph>
            <p className="text-white">
              {" "}
              {hasNet
                ? net > 0
                  ? `${net.toFixed(2)}`
                  : net.toFixed(2)
                : "0.00"}{" "}
              $
            </p>
          </CommonParagraph>
        </div>
      </div>
    </div>
  );
};

export default AutomationSummaryRow;
