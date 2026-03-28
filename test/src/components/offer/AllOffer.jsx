import React, { useState } from "react";
import { Gift, Calendar, Tag, Copy, Check, TrendingUp } from "lucide-react";
import { useTheme } from "@/hooks/custom/useTheme";
import crismasImage from "../../assets/dashboard/crismas.jpg";
import happNewYearsImage from "../../assets/dashboard/happNewYears.jpg";
import valentineImage from "../../assets/dashboard/love.jpg";

function AllOffer() {
  const [copiedCode, setCopiedCode] = useState(null);
  const { theme } = useTheme();

  const offers = [
    {
      id: 1,
      title: "Christmas Special",
      description:
        "Celebrate the festive season! Use coupon code to get $200 credited to your account",
      startDate: "2025-12-20",
      endDate: "2025-12-26",
      coupon: "XMAS2025",
      amount: "$200",
      bgGradient: "from-red-500 to-green-600",
      bgImage: crismasImage,
    },
    {
      id: 2,
      title: "New Year Celebration",
      description:
        "Start the new year with extra cash! Use coupon code and get $300 added to your wallet.",
      startDate: "2025-12-31",
      endDate: "2026-01-07",
      coupon: "NEWYEAR26",
      amount: "$300",
      bgGradient: "from-blue-500 to-cyan-600",
      bgImage: happNewYearsImage,
    },
    {
      id: 4,
      title: "Valentine's Day Gift",
      description:
        "Show love to your bets! Use coupon code and receive $100 directly credited to your account",
      startDate: "2025-02-10",
      endDate: "2025-02-14",
      coupon: "LOVE2025",
      amount: "$100",
      bgGradient: "from-rose-500 to-red-600",
      bgImage: valentineImage,
    },
  ];

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="">
      <div className="w-full">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 ${
            theme === "dark" ? "bg-darkerBlack/30" : "bg-lightestBlue/20"
          } py-6 rounded-2xl`}
        >
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`
        rounded-2xl p-2 lg:p-6 transition-all duration-300 
        backdrop-blur-md border
        ${
          theme === "dark"
            ? "bg-darkerBlack/80 border-lightBlack/50"
            : "bg-lightestBlue/40 border-mediumBlue/20"
        }
      `}
            >
              {/* Gradient Header */}
              <div
                className={`rounded-xl p-5 text-white relative overflow-hidden mb-4
         ${offer.bgGradient || "bg-gradient-to-r from-blue-600 to-indigo-600"}`}
              >
                <img
                  src={offer.bgImage}
                  alt="Offer"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="w-6 h-6" />
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        theme === "dark"
                          ? "bg-white text-gray-900"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      {offer.amount}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{offer.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p
                  className={`text-sm leading-relaxed ${
                    theme === "dark" ? "text-lightestGrey" : "text-darkGrey"
                  }`}
                >
                  {offer.description}
                </p>

                {/* Date Range */}
                <div
                  className={`flex items-center gap-2 text-xs font-medium p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-lightBlack/70 text-lightestGrey"
                      : "bg-white/70 text-gray-700"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                  </span>
                </div>

                {/* Coupon Code */}
                <div
                  className={`border-2 border-dashed rounded-xl p-3 ${
                    theme === "dark"
                      ? "border-lightBlack/60 bg-darkerBlack/50"
                      : "border-mediumBlue/30 bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span
                        className={`text-xs font-medium ${
                          theme === "dark"
                            ? "text-lightestGrey/80"
                            : "text-gray-600"
                        }`}
                      >
                        Promo Code:
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(offer.coupon, offer.id)}
                    className={`w-full flex items-center cursor-pointer justify-center gap-2 py-2.5 rounded-lg font-mono font-bold text-sm transition-colors ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    } text-white`}
                  >
                    <span>{offer.coupon}</span>
                    {copiedCode === offer.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  {copiedCode === offer.id && (
                    <p className="text-green-400 text-xs mt-2 text-center">
                      Copied!
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllOffer;
