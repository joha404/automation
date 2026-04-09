import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useResendOtp } from "@/hooks/api/auth/useResendOtp";
import { useVerifyOtp } from "@/hooks/api/auth/useVerifyOtp";
import AOS from "aos";
import "aos/dist/aos.css";
import Logo from "@/components/svgs/Logo";
import errorToast from "@/hooks/custom/errorToast";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/features/user/userSlice";

const Otp = () => {
  const location = useLocation();
  const { userData } = location?.state || {};
  const navigate = useNavigate();
  console.log(userData, userData?.email, "Dd");
  const dispatch = useDispatch();
  const OTP_LENGTH = 6;

  const email = userData?.email;

  const maskEmail = (value) => {
    if (!value || !value.includes("@")) return "your email";

    const [localPart, domain] = value.split("@");
    const visibleStart = localPart.slice(0, 2);
    const visibleEnd = localPart.length > 4 ? localPart.slice(-1) : "";
    const maskedLocal = `${visibleStart}${"*".repeat(
      Math.max(localPart.length - visibleStart.length - visibleEnd.length, 3),
    )}${visibleEnd}`;

    return `${maskedLocal}@${domain}`;
  };

  const maskedEmail = maskEmail(email);

  // State for OTP inputs
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const continueButtonRef = useRef(null);
  const otpInputRefs = useRef([]);

  const { mutate: resendOtp, isPending: otpLoading } = useResendOtp();
  const { mutate: verifyOtp, isPending: isLoading } =
    useVerifyOtp("/verify-account/");

  const focusOtpInput = (index) => {
    const focusInput = () => {
      const input = otpInputRefs.current[index];

      if (!input) return;

      input.focus();
      input.select();
    };

    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      window.requestAnimationFrame(focusInput);
      return;
    }

    setTimeout(focusInput, 0);
  };

  const handleChange = (index, value) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });
      return;
    }

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      const nextDigits = digits.slice(0, OTP_LENGTH - index).split("");

      nextDigits.forEach((digit, offset) => {
        newOtp[index + offset] = digit;
      });

      return newOtp;
    });

    const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
    if (nextIndex !== index) {
      focusOtpInput(nextIndex);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.preventDefault();
      focusOtpInput(index - 1);
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusOtpInput(index - 1);
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusOtpInput(index + 1);
    }
  };

  const handleResendOtp = () => {
    resendOtp(email, {
      onSuccess: () => {
        setOtp(new Array(OTP_LENGTH).fill(""));
        focusOtpInput(0);
      },
    });
  };
  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleVerifyOtp = () => {
    if (!isOtpComplete) {
      errorToast("OTP is required to proceed!");
      return;
    }

    verifyOtp(
      { email, otp },
      {
        onSuccess: () => {
          // ✅ Save auth data
          dispatch(setToken(userData?.tokens?.access_token));
          dispatch(setUser(userData));

          // ✅ Meta Pixel — CompleteRegistration (CORRECT PLACE)
          if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "CompleteRegistration", {
              content_name: "Email Verification",
              status: "success",
            });
          }
          localStorage.setItem("showWelcomePopup", "true");

          setTimeout(() => {
            navigate("/dashboard");
          }, 300);
        },

        onError: () => {
          navigate("/");
        },
      },
    );
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").trim();

    if (!paste) return;

    const pasteDigits = paste.slice(0, OTP_LENGTH - index).split("");
    setOtp((prevOtp) => {
      const updatedOtp = [...prevOtp];

      pasteDigits.forEach((digit, offset) => {
        updatedOtp[index + offset] = digit;
      });

      return updatedOtp;
    });

    focusOtpInput(Math.min(index + pasteDigits.length, OTP_LENGTH - 1));
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#032422] min-h-screen">
      <div className="container w-full ">
        {/* Logo */}
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
                to="/sign-in"
                className="flex justify-center items-center gap-2 text-darkGrey hover:text-[#0A9087] focus:text-[#04776f] focus:outline-none focus:ring-2 focus:ring-[#0A9087] focus:ring-offset-1 rounded transition-all duration-200 group mb-5"
              >
                <IoIosArrowBack className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <CommonTitle variant="regular" className="mb-2 font-semibold">
                Please check your email!
              </CommonTitle>
              <CommonParagraph
                variant="small"
                className="font-normal mx-auto xlg:mx-0  "
              >
                We&apos;ve emailed a 6-digit confirmation code to {maskedEmail},
                please enter the code in the box below to verify your email.
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    aria-label={`OTP digit ${index + 1}`}
                    ref={(element) => {
                      otpInputRefs.current[index] = element;
                    }}
                    className="lg:w-16 xl:h-16 xs:w-14 xs:h-14 w-9 h-9 text-center text-2xl font-semibold border border-[#0A9087] lg:rounded-lg rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white font-logo"
                    onChange={(e) => handleChange(index, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={(e) => handlePaste(index, e)}
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
              className="text-center w-full"
            >
              <CommonParagraph variant="small" className="font-normal">
                Didn&apos;t receive the email?{" "}
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

export default Otp;
