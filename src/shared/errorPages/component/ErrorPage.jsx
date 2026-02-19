import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import Logo from "@/components/svgs/Logo";
import AOS from "aos";
import "aos/dist/aos.css";

const ErrorPage = ({
  title = "Sorry, page not found!",
  subtitle = "Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.",
  image,
  buttonText = "Go to Home",
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
      <div className="flex xlg:justify-start justify-center mt-5  lg:mb-5">
        <Logo />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <div
          data-aos="fade-up"
          className="p-6 md:p-10 w-full max-w-3xl text-center"
        >
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
              className="w-[80%] text-center mx-auto  font-normal mb-6 md:mb-8"
            >
              {subtitle}
            </CommonParagraph>
          </div>

          <button
            onClick={() => navigate(redirectPath)}
            className="bg-gradient-to-l from-mediumBlue to-lightBlue text-white px-6 py-3 rounded-md text-sm cursor-pointer shadow-sm transition-colors duration-300 transform hover:bg-gradient-to-l hover:from-lightBlue hover:to-mediumBlue w-[200px]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
