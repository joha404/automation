import SubmitButton from "@/components/buttons/SubmitButton";
import InputField from "@/components/forms/InputField";
import Logo from "@/components/svgs/Logo";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import MetaText from "@/components/texts/MetaText";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { usePost } from "@/hooks/api/common/usePost";
import successToast from "@/hooks/custom/successToast";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoIosArrowBack } from "react-icons/io";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      identifier: "",
    },
  });
  const { mutate: forgotPass, isPending } = usePost(
    "/password-reset/request/",
    {
      secure: false,
    },
  );

  const onSubmit = (data) => {
    console.log(data);
    forgotPass(data, {
      onSuccess: (response) => {
        console.log(response, "ll");
        successToast(response?.message || "Invalid Mail!");
        navigate("/forgot-passowrd/verification", {
          state: {
            identifier: data?.identifier,
            identifier_type: response?.data?.identifier_type,
          },
        });
        reset();
      },
      onError: () => {
        navigate("/", {});
      },
    });
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#032422] min-h-screen">
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
          {/* Main content container - properly centered */}
          <div className="w-full flex flex-col items-center justify-center">
            {/* Title and description */}
            <div
              data-aos="fade-down"
              data-aos-delay="400"
              className="text-center mb-8 w-full"
            >
              <Link
                to="/sign-in"
                className="flex justify-center items-center gap-2 text-darkGrey hover:text-[#0A9087] focus:text-[#04776f] focus:outline-none focus:ring-2 focus:ring-[#0A9087] focus:ring-offset-1 rounded transition-all duration-200 group mb-5"
              >
                <IoIosArrowBack className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <CommonTitle variant="regular" className=" mb-2 font-semibold">
                Forgot your password?
              </CommonTitle>
              <CommonParagraph
                variant="small"
                className="font-normal mx-auto xlg:mx-0 "
              >
                Please enter the email address associated with your account, and
                we'll email you a link to reset your password.
              </CommonParagraph>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className="w-full">
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                <div className="flex flex-col justify-center items-center  mx-auto w-full">
                  <InputField
                    name="identifier"
                    type="identifier"
                    placeholder="Email/ Phone Number"
                    validationRules={{
                      required: "Email/Phone number is required!",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email / phone number",
                      },
                    }}
                    register={register}
                    register_as="identifier"
                    errors={errors}
                    autoComplete="identifier"
                  />
                </div>

                <div className="w-full xl:pt-8 pt-4">
                  <SubmitButton
                    type="submit"
                    variant="bg_black"
                    isLoading={isPending}
                    loadingText="Submitting"
                    disabled={isPending}
                  >
                    Submit Now
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

export default ForgotPassword;
