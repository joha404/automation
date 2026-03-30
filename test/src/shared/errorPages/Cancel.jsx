import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import Logo from "@/components/svgs/Logo";
import AOS from "aos";
import "aos/dist/aos.css";

const Cancel = ({
  title = "OOps! Cancelled",
  subtitle = "Your subscription has been cancelled. No changes were made.",
  buttonText = "Go Back",
  redirectPath = "/dashboard",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Logo */}
      <div className="flex xlg:justify-start justify-center mt-5 lg:mb-5">
        <Logo />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <div
          data-aos="fade-up"
          className="p-6 md:p-10 w-full max-w-3xl text-center"
        >
          {/* Cancel Icon */}
          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div
            data-aos="fade"
            data-aos-delay="200"
            className="text-center mx-auto 2xl:w-[80%]"
          >
            <CommonTitle variant="regular" className="mb-5 font-semibold">
              {title}
            </CommonTitle>

            <CommonParagraph
              variant="small"
              className="w-[80%] text-center mx-auto font-normal mb-6 md:mb-8"
            >
              {subtitle}
            </CommonParagraph>
          </div>

          <button
            onClick={() => navigate(redirectPath)}
            className="bg-gradient-to-l from-red-500 to-red-600 text-white px-6 py-3 rounded-md text-sm cursor-pointer shadow-sm transition-colors duration-300 transform hover:bg-gradient-to-l hover:from-red-600 hover:to-red-700 w-[200px]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;