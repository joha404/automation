import { getUltimateGraph } from "@/api/home/hero.api";
import CommonTitle from "@/components/texts/CommonTitle";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

// Move format date outside component to avoid recreation
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function UltimateGraph() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUltimateGraph();
      if (response?.data?.chartPoints) {
        setChartData(response.data.chartPoints);
      } else {
        setError("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize chart data to prevent recreation
  const data = useMemo(() => {
    if (!chartData.length) return null;

    return {
      labels: chartData.map((item) => formatDate(item.date)),
      datasets: [
        {
          label: "Cumulative Units",
          data: chartData.map((item) => item.cumulative_units),
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.6)");
            gradient.addColorStop(0.25, "rgba(37, 99, 235, 0.4)");
            gradient.addColorStop(0.5, "rgba(29, 78, 216, 0.2)");
            gradient.addColorStop(0.75, "rgba(30, 64, 175, 0.1)");
            gradient.addColorStop(1, "rgba(30, 58, 138, 0.02)");
            return gradient;
          },
          borderColor: "#3b82f6",
          borderWidth: isMobile ? 2.5 : 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: isMobile ? 5 : 7,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#3b82f6",
          pointHoverBorderWidth: 3,
        },
      ],
    };
  }, [chartData, isMobile]);

  // Memoize options to prevent recreation
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: function (context) {
            let tooltipEl = document.getElementById("chartjs-tooltip");

            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.style.position = "absolute";
              tooltipEl.style.pointerEvents = "none";
              tooltipEl.style.transition = "all 0.1s ease";
              tooltipEl.style.zIndex = "9999";
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            if (tooltipModel.body) {
              const dataIndex = tooltipModel.dataPoints[0].dataIndex;
              const data = chartData[dataIndex];
              const value = data.cumulative_units.toFixed(2);
              const dateStr = new Date(data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              tooltipEl.innerHTML = `
              <div class="relative">
                <div class="absolute inset-0 bg-blue-500/20 rounded-xl "></div>
                <div class="relative rounded-2xl p-4 border-2 border-blue-500/40 bg-gradient-to-br from-gray-900/98 to-gray-800/98">
                  <p class="text-xs font-semibold mb-3 text-blue-400 uppercase tracking-wider">
                    ${dateStr}
                  </p>
                  <div class="flex items-baseline gap-2">
                    <p class="text-2xl font-black text-white">${value}</p>
                    <span class="text-sm text-gray-400 font-medium">units</span>
                  </div>
                </div>
              </div>
            `;
            }

            const position = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.opacity = 1;
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX + "px";
            tooltipEl.style.top =
              position.top +
              window.pageYOffset +
              tooltipModel.caretY -
              10 +
              "px";
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#9ca3af",
            font: {
              size: isMobile ? 9 : 11,
              weight: 500,
            },
            maxRotation: 0,
            autoSkipPadding: isMobile ? 30 : 40,
          },
          border: {
            display: false,
          },
        },
        y: {
          grid: {
            color: "#4b5563",
            drawBorder: false,
            lineWidth: 1,
            drawTicks: false,
          },
          ticks: {
            color: "#9ca3af",
            font: {
              size: isMobile ? 9 : 11,
              weight: 500,
            },
            padding: 10,
          },
          border: {
            display: false,
          },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
    }),
    [chartData, isMobile],
  );

  // Memoize statistics
  const statistics = useMemo(() => {
    if (!chartData.length) return null;

    return {
      totalGrowth: (
        chartData[chartData.length - 1]?.cumulative_units -
        chartData[0]?.cumulative_units
      ).toFixed(2),
      startDate: chartData[0]?.date,
      endDate: chartData[chartData.length - 1]?.date,
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0a0e27] via-[#0f1629] to-[#0a0e27] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-400 text-sm font-medium">
            Loading chart data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !chartData || chartData.length === 0) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0a0e27] via-[#0f1629] to-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-gray-400 mb-2">
            {error || "No chart data available"}
          </p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-darkBlack flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl w-full relative z-10">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12">
          <CommonTitle
            variant="regular"
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-3"
          >
            Ultimate Package All-time Results
          </CommonTitle>
        </div>

        {/* Main Chart Card */}
        <div className="relative group">
          <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-700/50 overflow-hidden">
            {/* Chart Container */}
            <div className="relative z-10 w-full h-[300px] xs:h-[350px] sm:h-[450px] lg:h-[500px] xl:h-[550px]">
              {data && <Line ref={chartRef} data={data} options={options} />}
            </div>

            {/* Bottom Info Bar */}
            {statistics && (
              <div className="mt-6 pt-5 border-t border-gray-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Date Range */}
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                        Timeline
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-medium">
                        {statistics.startDate} → {statistics.endDate}
                      </p>
                    </div>
                  </div>

                  {/* Growth Badge */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-400">Total Growth</p>
                      <p className="text-sm sm:text-base text-blue-400 font-bold">
                        +{statistics.totalGrowth} units
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
