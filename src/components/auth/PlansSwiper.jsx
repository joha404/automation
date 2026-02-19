import { Swiper, SwiperSlide } from "swiper/react";
import MobilePlanCard from "./MobilePlanCard";
import "swiper/css";
import "swiper/css/bundle";

export default function PlansSwiper({
  plans,
  calculatePrice,
  calculateSavings,
  isMonthly,
  isQuarterly,
  isAnnual,
  isDark,
}) {
  // Handle Contact Us for Enterprise API
  const handleContactUs = () => {
    window.location.href =
      "mailto:customersupport@techtakes.ai?subject=Tech Takes Enterprise API Demo Request";
  };

  // Check if there are only 2 items
  const hasTwoItems = plans.length === 2;

  return (
    <div
      className={`block xl:hidden mb-4 w-full px-2 ${hasTwoItems ? "flex justify-center" : ""}`}
    >
      <div className={hasTwoItems ? "max-w-3xl w-full" : "w-full"}>
        <Swiper
          slidesPerView={1.2}
          spaceBetween={12}
          centeredSlides={false}
          breakpoints={{
            480: {
              slidesPerView: 1.5,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: hasTwoItems ? 2 : 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: hasTwoItems ? 2 : 2.5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: hasTwoItems ? 2 : 3,
              spaceBetween: 24,
            },
          }}
          className="mobile-plans-swiper !overflow-visible"
        >
          {plans.map((plan, index) => {
            // Check if this is the Enterprise API card
            if (plan.isEnterprise) {
              return (
                <SwiperSlide key={`enterprise-api-mobile-${index}`}>
                  <div
                    className={`group relative rounded-2xl p-6 border transition-all duration-400 ease-in flex flex-col h-full ${
                      isDark
                        ? "bg-gradient-to-br from-darkBlack to-mediumBlack border-lightBlack shadow-xl"
                        : "bg-gradient-to-br from-white to-extraLightBlue border-gray-200 shadow-lg shadow-gray-900/10"
                    }`}
                  >
                    {/* Plan Header */}
                    <div className="text-center mb-6 relative z-10">
                      <p
                        className={`font-bold mb-3 uppercase tracking-widest text-xs ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {plan.region}
                      </p>
                    </div>

                    {/* Elegant Divider */}
                    <div className="relative mb-6">
                      <div
                        className={`h-px ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                      <div className={`absolute inset-0 flex justify-center`}>
                        <div
                          className={`w-24 h-px ${
                            isDark
                              ? "bg-gradient-to-r from-blue-500 to-purple-500"
                              : "bg-gradient-to-r from-blue-400 to-purple-400"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex-grow space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          <div
                            className={`flex-shrink-0 flex items-center justify-center mr-3 w-5 h-5 rounded-full transition-all duration-300 ${
                              isDark
                                ? "text-emerald-400 bg-emerald-500/20"
                                : "text-emerald-600 bg-emerald-50"
                            }`}
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p
                            className={`leading-relaxed text-sm ${
                              isDark ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            {feature.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto pt-4">
                      <button
                        onClick={handleContactUs}
                        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                          isDark
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        Contact Us
                      </button>
                    </div>

                    {/* Subtle Glow Effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        isDark
                          ? "bg-gradient-to-br from-blue-500/5 to-purple-700/3"
                          : "bg-gradient-to-br from-blue-500/3 to-purple-500/3"
                      }`}
                    ></div>
                  </div>
                </SwiperSlide>
              );
            }

            // Regular plan cards
            const finalPrice = calculatePrice(plan);
            const savings = calculateSavings(plan);

            // Parse the price value for calculations
            const priceValue = finalPrice
              ? parseFloat(finalPrice.replace(/[^0-9.]/g, ""))
              : 0;
            const monthlyEquivalent = (
              priceValue / (isAnnual ? 12 : isQuarterly ? 3 : 1)
            ).toFixed(2);

            // Get the correct package_id based on billing cycle
            const packageId = isMonthly
              ? plan.monthlyPackageId
              : isQuarterly
                ? plan.quarterlyPackageId
                : plan.annualPackageId;

            // Create a plan object that matches what MobilePlanCard expects
            const planCardData = {
              id: packageId,
              name: plan.region,
              features: plan.features || [],
              isPopular: plan.isPopular || false,
            };

            return (
              <SwiperSlide key={`${plan.region}-mobile-${index}-${packageId}`}>
                <MobilePlanCard
                  plan={planCardData}
                  finalPrice={priceValue.toFixed(2)}
                  savings={savings}
                  monthlyEquivalent={monthlyEquivalent}
                  isMonthly={isMonthly}
                  isAnnual={isAnnual}
                  isDark={isDark}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
