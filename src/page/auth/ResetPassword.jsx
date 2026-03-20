import SubmitButton from "@/components/buttons/SubmitButton";
import InputField from "@/components/forms/InputField";
import Logo from "@/components/svgs/Logo";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import MetaText from "@/components/texts/MetaText";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { usePost } from "@/hooks/api/common/usePost";
import successToast from "@/hooks/custom/successToast";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import PasswordField from "@/components/forms/PasswordField";
import { IoIosArrowBack } from "react-icons/io";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier } = location?.state || {};

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      identifier: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const { mutate: resetPassword, isPending } = usePost(
    `/password-reset/change-password/`,
    {
      secure: false,
    },
  );

  const onSubmit = (data) => {
    const payload = {
      ...data,
      identifier,
    };

    resetPassword(payload, {
      onSuccess: (response) => {
        successToast(response?.message || "Reset password failed!");
        navigate("/");
        reset();
      },
      onError: () => {
        navigate("/");
      },
    });
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#032422]  min-h-screen">
      <div className="container w-full">
        {/* Logo */}
        <div
          data-aos="fade-right"
          data-aos-delay="1000"
          className="flex xlg:justify-start justify-center mt-5  lg:mb-5"
        >
          <Logo />
        </div>
        <div className="md:max-w-xl mx-auto min-h-[80vh] h-full flex flex-col justify-center items-center">
          <div className="w-full flex flex-col items-center justify-center">
            <div
              data-aos="fade-down"
              data-aos-delay="400"
              className="text-center mb-8 w-full"
            >
              <Link
                to="/forgot-passowrd"
                className="flex justify-center items-center gap-2 text-darkGrey hover:text-[#0A9087] focus:text-[#04776f] focus:outline-none focus:ring-2 focus:ring-[#0A9087] focus:ring-offset-1 rounded transition-all duration-200 group mb-5"
              >
                <IoIosArrowBack className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <CommonTitle variant="regular" className=" mb-2 font-semibold">
                Enter your new password
              </CommonTitle>
              <CommonParagraph
                variant="small"
                className="mb-5 font-normal  mx-auto xlg:mx-0 "
              >
                Please enter the email address associated with your account, and
                we'll email you a link to reset your password.
              </CommonParagraph>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className="w-full">
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="flex flex-col justify-center items-center  mx-auto w-full gap-5">
                  <PasswordField
                    name="new_password"
                    type="password"
                    placeholder="New password"
                    validationRules={{
                      required: "Password is required!",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters!",
                      },
                    }}
                    register={register}
                    register_as="new_password" // Must match name
                    errors={errors}
                    autoComplete="new-password" // Changed for better browser handling
                  />

                  <PasswordField
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm password"
                    validationRules={{
                      required: "Confirm Password is required!",
                      validate: (value) =>
                        value === getValues("new_password") || // Must match new_password field name
                        "Passwords must match",
                    }}
                    register={register}
                    register_as="confirm_password" // Must match name
                    errors={errors}
                    autoComplete="confirm_password"
                  />
                </div>

                <div className="w-full xl:pt-8 pt-4">
                  <SubmitButton
                    type="submit"
                    variant="bg_black"
                    isLoading={isPending}
                    loadingText="Updating"
                    disabled={isPending}
                  >
                    Update Password
                  </SubmitButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
