import { usePost } from "@/hooks/api/common/usePost";
import successToast from "@/hooks/custom/successToast";
import { setToken, setUser } from "@/redux/features/user/userSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import image from "@/assets/auth/sign-in.png";
import MetaText from "@/components/texts/MetaText";
import AOS from "aos";
import "aos/dist/aos.css";
import CommonParagraph from "@/components/texts/CommonParagraph";
import InputField from "@/components/forms/InputField";
import PasswordField from "@/components/forms/PasswordField";
import SubmitButton from "@/components/buttons/SubmitButton";
import CommonTitle from "@/components/texts/CommonTitle";
import Logo from "@/components/svgs/Logo";
import { motion } from "framer-motion";
import { GiCheckMark } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      login: "", // Changed from username to login
      password: "",
    },
  });

  const { mutate: login, isPending } = usePost("/signin/", {
    secure: false,
  });

  // Function to determine if input is email or username
  const getLoginType = (login) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(login) ? "email" : "username";
  };

  const onSubmit = (data) => {
    const loginType = getLoginType(data.login);

    const payload = {
      login: data.login,
      password: data.password,
      login_type: loginType, // Send the determined type to backend
    };

    login(payload, {
      onSuccess: (response) => {
        successToast(response?.message || "Sign In successful!");
        dispatch(setToken(response?.data?.tokens?.access_token));
        dispatch(setUser(response?.data));
        localStorage.setItem("showWelcomePopup", "true");
        navigate("/dashboard");
        reset();
      },
      onError: (error) => {
        if (error?.response?.data.isEmailVerified === false) navigate("/");
      },
    });
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#032422]">
      {/* form section */}
      <div className="w-full container">
        {/* Logo */}
        <div
          data-aos="fade-right"
          data-aos-delay="1000"
          className="flex xlg:justify-start justify-center mt-5  lg:mb-5"
        >
          <Logo />
        </div>

        <div className="md:max-w-xl mx-auto min-h-[80vh] h-full flex flex-col justify-center items-center">
          <div
            data-aos="fade-down"
            data-aos-delay="400"
            className="text-center  xl:mb-10 mb-5"
          >
            <CommonTitle
              variant="regular"
              className="mb-2 font-semibold xl:mt-2 mt-10 font-logo text-[#0A9087]"
            >
              Login
            </CommonTitle>

            <CommonParagraph
              variant="small"
              className="font-normal text-white font-logo"
            >
              Enter your details below to view your dashboard.
            </CommonParagraph>
          </div>

          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            className=" w-full h-full"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="flex flex-col justify-center items-center xl:gap-8 gap-4 mx-auto">
                <InputField
                  name="login"
                  type="text"
                  placeholder="Username or Email" // Updated placeholder
                  register={register}
                  register_as="login"
                  errors={errors}
                  validationRules={{
                    required: "Username or email is required!",
                    minLength: {
                      value: 3,
                      message: "Must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_@.+_-]+$/, // Allow email characters
                      message: "Must be letters, numbers, and symbols",
                    },
                  }}
                  autoComplete="username"
                />

                <PasswordField
                  name="password"
                  type="password"
                  placeholder="Password"
                  validationRules={{
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  }}
                  register={register}
                  register_as="password"
                  errors={errors}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-between items-center w-full mt-5 xl:mb-8 mb-6">
                <div className="flex items-center gap-3">
                  {/* Checkbox button */}
                  <button
                    type="button"
                    onClick={() => setChecked(!checked)}
                    className={`relative w-5 h-5 border-2 rounded-sm flex justify-center items-center shadow transition-all duration-300 cursor-pointer ${
                      checked ? "border-[#0A9087]" : "border-mediumGrey"
                    }`}
                  >
                    {checked && (
                      <motion.div
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute w-[14px] h-[14px] flex items-center justify-center"
                      >
                        <GiCheckMark className="text-[#0A9087] w-full h-full" />
                      </motion.div>
                    )}
                  </button>

                  {/* Label */}
                  <CommonParagraph
                    variant="small"
                    className="font-normal text-white"
                  >
                    Remember me
                  </CommonParagraph>
                </div>
                <div>
                  <Link to={"/forgot-password"}>
                    <CommonParagraph
                      variant="small"
                      className=" hover:text-[#0A9087] transition-colors duration-150 "
                    >
                      Forgot Password?
                    </CommonParagraph>
                  </Link>
                </div>
              </div>

              <div className="w-full">
                <SubmitButton
                  type="submit"
                  variant="bg_black"
                  isLoading={isPending}
                  loadingText="Signing In"
                  disabled={isPending}
                >
                  Continue
                </SubmitButton>
              </div>
            </form>
            <div className="text-center flex justify-center mt-3">
              <CommonParagraph className="font-normal text-lightGrey ">
                {"Don't have an account?"}
                <Link
                  to={"/sign-up"}
                  className="text-greenDark hover:text-greenExtraDark font-semibold"
                >
                  {" "}
                  <span className="text-[#0A9087] font-medium cursor-pointer">
                    {" "}
                    Sign Up
                  </span>
                </Link>
              </CommonParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
