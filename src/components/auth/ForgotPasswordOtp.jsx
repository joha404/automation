import Logo from "@/components/svgs/Logo";
import MetaText from "@/components/texts/MetaText";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import errorToast from "@/hooks/custom/errorToast";
import { IoIosArrowBack } from "react-icons/io";
import { useVerifyPasswordOtp } from "@/hooks/api/auth/useVerifyPasswordOtp";
import { useResetResendOtp } from "@/hooks/api/auth/useResetResendOtp";

const ForgotPasswordOtp = () => {
  const location = useLocation();
  const { identifier, identifier_type } = location?.state || {};
  const navigate = useNavigate();
  console.log(identifier_type, identifier);

  // State for OTP inputs
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const continueButtonRef = useRef(null);

  const { mutate: resendOtp, isPending: otpLoading } = useResetResendOtp();
  const { mutate: verifyOtp, isPending: isLoading } = useVerifyPasswordOtp(
    "/password-reset/verify-otp/",
  );
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleResendOtp = () => {
    resendOtp(identifier, {
      onSuccess: () => {
        setOtp(new Array(6).fill(""));
      },
    });
  };

  const handleVerifyOtp = () => {
    if (!isOtpComplete) {
      errorToast("OTP is required to proceed!");
      return;
    }
    verifyOtp(
      { identifier, otp },
      {
        onSuccess: (res) => {
          navigate("/reset-password", { state: { identifier: identifier } });
        },
        //have to remove it when connected to api
        onError: () => {
          navigate("/reset-password");
        },
      },
    );
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(paste)) return;

    const pasteDigits = paste.slice(0, otp.length).split("");
    const updatedOtp = [...otp];
    pasteDigits.forEach((digit, i) => {
      updatedOtp[i] = digit;
    });

    setOtp(updatedOtp);

    const nextInput = document.getElementById(
      `otp-${Math.min(pasteDigits.length - 1, otp.length - 1)}`,
    );
    if (nextInput) nextInput.focus();
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#032422] min-h-screen">
      <div className="container w-full">
        {/* Logo section - centered for all screens */}

        <div
          data-aos="fade-right"
          data-aos-delay="1000"
          className="flex xlg:justify-start justify-center mt-5  lg:mb-5"
        >
          <Logo />
        </div>

        <div className="md:max-w-xl mx-auto min-h-[80vh] h-full flex flex-col justify-center items-center">
          {/* Main content container - properly centered */}
          <div className="w-full flex flex-col items-center justify-center">
            {/* Title and description */}
            <div
              data-aos="fade-down"
              data-aos-delay="400"
              className="text-center  mb-8 w-full"
            >
              <Link
                to="/forgot-password"
                className="flex  justify-center items-center gap-2 text-white font-logo  hover:text-mediumBlue focus:text-mediumBlue focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 rounded transition-all duration-200 group  mb-5"
              >
                <IoIosArrowBack className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <CommonTitle variant="regular" className="mb-2 font-semibold">
                Please check your{" "}
                {`${identifier_type === "email" ? "email" : "phone"}`}!
              </CommonTitle>
              <CommonParagraph
                variant="small"
                className="font-normal  mx-auto xlg:mx-0 mb-5"
              >
                We've emailed a 6-digit confirmation code to acb@domain, please
                enter the code in below box to verify your email.{" "}
              </CommonParagraph>
            </div>

            {/* OTP input fields */}
            <div className="mb-10 w-full">
              <div
                data-aos="zoom-in"
                data-aos-delay="400"
                className="flex justify-center lg:gap-8 sm:gap-5 gap-3"
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    maxLength={1}
                    className="lg:w-16 xl:h-16 xs:w-14 xs:h-14 w-9 h-9 text-center text-2xl font-semibold border border-[#0A9087] lg:rounded-lg rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white font-logo"
                    onChange={(e) => handleChange(index, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="w-full flex justify-center xlg:justify-start mb-5">
              <div className="w-full" data-aos="fade-up" data-aos-delay="400">
                <SubmitButton
                  type="button"
                  ref={continueButtonRef}
                  onClick={handleVerifyOtp}
                  variant="bg_black"
                  isLoading={isLoading}
                  loadingText="Verifying"
                  disabled={isLoading || !isOtpComplete}
                  className="w-full py-3"
                >
                  Verify
                </SubmitButton>
              </div>
            </div>

            {/* Resend code section */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className=" text-center w-full"
            >
              <CommonParagraph variant="small" className="font-normal ">
                Didn't receive the email?{" "}
                <button
                  onClick={!otpLoading ? handleResendOtp : undefined}
                  disabled={otpLoading}
                  className="text-[#0A9087] border-[#0A9087] font-medium hover:underline focus:outline-none cursor-pointer"
                >
                  {otpLoading ? "Resending..." : "Resend Code"}
                </button>
              </CommonParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOtp;
