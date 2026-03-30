import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import { MdCalendarMonth } from "react-icons/md";
import { useState, useEffect } from "react";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const Header = () => {
  const { theme } = useTheme();
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    // 🗓 Format date in user's local timezone
    const dateOptions = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString(undefined, dateOptions);
    setCurrentDate(formattedDate);

    let greetingMsg = "Welcome"; // default fallback

    if (hour >= 8 && hour < 13) {
      greetingMsg = "Good Morning";
    } else if (hour >= 13 && hour < 17) {
      greetingMsg = "Good Afternoon";
    } else if (hour >= 17 && hour < 24) {
      greetingMsg = "Good Evening";
    }

    setGreeting(greetingMsg);
  }, []);

  const { data: response, isLoading } = useGet("/greeting/", {
    queryKey: ["header"],
    secure: true,
  });

  const greet = response?.data || [];

  if (isLoading) {
    return (
      <div className="w-full">
        <ScreenLoader
          fullScreen={false}
          containerClassName="min-h-[180px] px-4 py-10"
        />
      </div>
    );
  }

  return (
    <CommonWrapper variant="bottomSmall">
      <div
        className={`mb-2 lg:pt-1 flex flex-col lg:flex-row justify-center items-center gap-4 md:gap-6 font-primary`}
      >
        {/* Centered section with logo and greeting */}
        <div className="flex flex-row sm:items-center justify-center items-start gap-3 sm:gap-4 w-full text-center sm:text-left">
          <div
            className={`sm:block hidden lg:mb-2 md:mb-3 sm:mb-8 mt-1  sm:p-3 p-1 xl:rounded-xl rounded-md flex items-center justify-center flex-shrink-0 bg-[#0A9087]`}
          >
            <MdCalendarMonth className="sm:text-xl text-base text-white" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <CommonTitle
              variant="small"
              className={`font-bold  font-logo ${
                theme === "dark" ? "text-[#0A9087]" : "text-darkerBlue"
              }`}
            >
              {greeting}, {greet?.username || "user"}!
            </CommonTitle>
            <div className="flex flex-col md:flex-row items-center  lg:gap-2 gap-1 text-xs xs:text-sm lg:mt-1">
              <CommonParagraph variant="small" className={`whitespace-nowrap`}>
                Your Betting Command Center
              </CommonParagraph>
              <CommonParagraph
                variant="small"
                className={`px-5 py-1 rounded-xl whitespace-nowrap font-medium ${
                  theme === "dark"
                    ? "bg-[#032422] text-[#0A9087]"
                    : "bg-blue-100 text-darkBlue"
                }`}
              >
                {currentDate}
              </CommonParagraph>
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Header;
