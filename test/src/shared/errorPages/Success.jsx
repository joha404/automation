import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import Logo from "@/components/svgs/Logo";
import { GiCheckMark } from "react-icons/gi";
import { FaCalendarAlt, FaEnvelope, FaCrown } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "@/hooks/custom/useTheme";
import { getMySubscription } from "@/api/subscription/success.api";

/* =========================
   Skeleton Loader Component
========================= */
const SuccessSkeleton = ({ isDark }) => {
  const base = isDark ? "bg-gray-700/50" : "bg-gray-200";
  const shimmer = "animate-pulse";

  return (
    <div className="w-full max-w-4xl p-6 md:p-8 rounded-3xl shadow-md backdrop-blur-sm">
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 rounded-full ${base} ${shimmer}`} />
      </div>

      <div className="text-center mb-6">
        <div className={`h-8 w-64 mx-auto mb-2 rounded ${base} ${shimmer}`} />
        <div className={`h-4 w-80 mx-auto rounded ${base} ${shimmer}`} />
      </div>

      <div className={`p-4 mb-6 rounded-2xl ${base} ${shimmer}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`h-20 rounded-xl ${base} ${shimmer}`} />
        <div className={`h-20 rounded-xl ${base} ${shimmer}`} />
        <div className={`h-20 rounded-xl md:col-span-2 ${base} ${shimmer}`} />
      </div>

      <div className={`h-24 rounded-xl mb-6 ${base} ${shimmer}`} />

      <div className="flex justify-center">
        <div className={`h-12 w-48 rounded-xl ${base} ${shimmer}`} />
      </div>
    </div>
  );
};

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const { theme } = useTheme();
  const fbTrackedRef = useRef(false);
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const fetchData = async () => {
    try {
      const res = await getMySubscription();
      if (res?.status === 200 && res?.data) {
        setSubscription(res.data);
      }
    } catch (error) {
      console.error("Subscription fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    fetchData();
  }, []);

  const data = subscription;
  const pkg = data?.package;
  // useEffect(() => {
  //   if (
  //     !loading &&
  //     pkg?.price &&
  //     typeof window !== "undefined" &&
  //     window.fbq &&
  //     !fbTrackedRef.current
  //   ) {
  //     window.fbq("track", "Purchase", {
  //       value: Number(pkg.price),
  //       currency: "USD",
  //       content_ids: pkg?.stripe_price_id ? [pkg.stripe_price_id] : [],
  //       content_type: "product",
  //       transaction_id: pkg?.order_id || `order_${Date.now()}`,
  //     });

  //     fbTrackedRef.current = true;

  //     console.log(" FB Pixel Event Fired: Purchase", pkg.price);
  //   }
  // }, [loading, pkg]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-6 transition-colors duration-300 overflow-hidden ${
        isDark
          ? "bg-[#020C0B]"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Animated Background */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          }`}
        />
        <div
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-purple-500" : "bg-purple-300"
          }`}
        />
      </div> */}

      {/* Logo */}
      <div className="flex justify-center mb-4 relative z-10">
        <Logo />
      </div>

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-4xl rounded-3xl shadow-md backdrop-blur-sm transition-all duration-300 ${
          isDark ? "bg-[#054844] " : "bg-white/90 border border-gray-200/50"
        }`}
      >
        {loading ? (
          <SuccessSkeleton isDark={isDark} />
        ) : (
          <div className="p-6 md:p-8">
            {/* Success Icon */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                  isDark ? "bg-[#0d0d0d]" : "bg-green-400/30"
                }`}
              />
              <div
                className={`relative w-full h-full rounded-full flex items-center justify-center shadow-lg ${
                  isDark ? "bg-[#0A9087]" : "bg-[#0A9087]"
                }`}
              >
                <GiCheckMark className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>

            {/* Title */}
            <div className="mb-4 text-center">
              <CommonTitle className="mb-2 font-semibold xl:mt-2 mt-10 text-[#0A9087]">
                Payment Successful!
              </CommonTitle>
              <CommonParagraph
                variant="small"
                className={
                  isDark ? "font-normal text-lightGrey" : "text-gray-600"
                }
              >
                Welcome to{" "}
                <strong className="text-[#0A9087]">{pkg?.name}</strong>! Your
                subscription is now active.
              </CommonParagraph>
            </div>

            {/* Package Card */}
            <div
              className={`mb-4 p-4 rounded-2xl ${
                isDark ? "bg-[#021716] " : "bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaCrown className="text-yellow-500" />
                <h3
                  className={`text-2xl font-bold font-logo ${isDark ? "text-white " : "text-black"}`}
                >
                  {pkg?.name}
                </h3>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-3xl font-bold text-[#0A9087]">
                  ${pkg?.price}
                </span>
                <span className="text-lightGrey">/ {pkg?.interval}</span>
              </div>
            </div>

            {/* Dates & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-lightGrey">
              {[
                { label: "Start Date", value: data?.start_date },
                { label: "Next Billing", value: data?.end_date },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl ${
                    isDark
                      ? "bg-[#021716]  text-bold"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FaCalendarAlt />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <p className="ml-6 font-medium text-lightGrey">
                    {new Date(item.value).toLocaleDateString()}
                  </p>
                </div>
              ))}

              <div
                className={`p-3 rounded-xl md:col-span-2 ${
                  isDark ? "bg-[#021716]  border-lightGrey " : "bg-gray-100"
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    isDark ? "text-white " : " text-black"
                  }`}
                >
                  <FaEnvelope />
                  <span className="font-semibold text-bold ">
                    Account Email
                  </span>
                </div>
                <p className="ml-6 font-medium text-lightGrey font-logo">
                  {data?.user}
                </p>
              </div>
            </div>

            {/* Description */}
            <div
              className={`mb-4 p-4 rounded-xl ${
                isDark ? " text-white" : "text-black"
              }`}
            >
              <div className="flex gap-2">
                <BsLightningChargeFill />
                <p>{pkg?.description}</p>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-xl bg-[#0A9087] cursor-pointer text-white font-bold shadow-lg hover:scale-105 transition"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
