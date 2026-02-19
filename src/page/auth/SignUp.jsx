import { usePost } from "@/hooks/api/common/usePost";
import successToast from "@/hooks/custom/successToast";
import { setToken, setUser } from "@/redux/features/user/userSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import image from "@/assets/auth/sign-up.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { FaCamera } from "react-icons/fa";
import countryCode from "@/hooks/custom/countryCode";
import CountryDropdown from "@/components/forms/CountryDropdown";
import errorToast from "@/hooks/custom/errorToast";
import { useGet } from "@/hooks/api/common/useGet";

const SignUp = () => {
  const [checked, setChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [selectedOption, setSelectedOption] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // Capture referral code from URL when component mounts
  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) {
      localStorage.setItem("referral_code", refParam);
    }
  }, [searchParams]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      username: "",
      phone_number: "",
      phone_country: "+1",
      country: "USA",
      profileImage: null,
      create_option: "",
    },
    mode: "onChange",
  });

  const { mutate: SignUp, isPending } = usePost("/signup/", {
    secure: false,
    isFileUpload: true,
  });

  // Set default country values on mount
  useEffect(() => {
    setValue("country", "USA");
    setValue("phone_country", "+1");
  }, [setValue]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setValue("profileImage", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (countryValue) => {
    setSelectedCountry(countryValue);
    setValue("country", countryValue);

    // Also update the phone country code
    const selectedCountryObj = countryCode.find(
      (country) => country.value === countryValue,
    );
    if (selectedCountryObj) {
      setValue("phone_country", selectedCountryObj.code);
    }
  };

  const handleOptionChange = (optionValue) => {
    setSelectedOption(optionValue);
    setValue("create_option", optionValue);
  };

  const formatPhoneNumber = (code, number) => {
    if (!number) return "";
    return number.startsWith(code) ? number : `${code}${number}`;
  };

  const onSubmit = (data) => {
    // Find the selected country object to get the code
    const selectedCountryObj = countryCode.find(
      (country) => country.value === selectedCountry,
    );

    const phoneCode = selectedCountryObj?.code || "+1";
    const countryShortForm = selectedCountryObj?.value || "USA";

    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirm_password", data.password);
    formData.append("username", data.username);

    formData.append("phone_number", data.phone_number);
    formData.append("phone_country", phoneCode);
    formData.append("country", countryShortForm);

    formData.append("opt_in", marketingChecked ? "true" : "false");
    formData.append("create_option", selectedOption);

    if (profileImage) {
      formData.append("profile_img", profileImage);
    } else {
      errorToast("Please upload a profile image.");
      return;
    }

    // Log form data for debugging
    console.log("Form data being sent:");
    console.log("Country:", countryShortForm);
    console.log("Phone Country Code:", phoneCode);
    console.log("Phone Number:", data.phone_number);

    SignUp(formData, {
      onSuccess: (response) => {
        console.log("Signup response:", response);
        successToast(response?.message || "OTP sent to mail!");

        setTimeout(() => {
          navigate("/email-verification", {
            state: { userData: response?.data },
          });
        }, 300);

        reset();
        setProfileImage(null);
        setPreviewImage(null);
        setSelectedOption("");
        setSelectedCountry("USA");
      },
      onError: (error) => {
        console.error("Signup error:", error);
        errorToast(error?.message || "Signup failed!");
      },
    });
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const createOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter/X" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedIn", label: "LinkedIn" },
    { value: "reddit", label: "Reddit" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "Youtube" },
    { value: "google_search", label: "Google search" },
    { value: "friends_family", label: "Friends/family" },
    { value: "referral_programme", label: "Tech Takes Referral program" },
    { value: "podcast", label: "Player Instinct Podcast" },
    { value: "mouth", label: "Word of mouth" },
  ];

  return (
    <div>
      <div className="w-full container">
        {/* Logo */}
        <div
          data-aos="fade-right"
          data-aos-delay="1000"
          className="flex xlg:justify-start justify-center mt-5 lg:mb-5"
        >
          <Logo />
        </div>

        <div className="md:max-w-xl mx-auto min-h-[80vh] h-full flex flex-col justify-center items-center">
          <div
            data-aos="fade-down"
            data-aos-delay="400"
            className="text-center 2xl:w-[80%] xl:mb-10 mb-5"
          >
            <CommonTitle
              variant="regular"
              className="mb-2 font-semibold xl:mt-2 mt-10 text-lightGrey"
            >
              Create your Account
            </CommonTitle>

            <CommonParagraph
              variant="small"
              className="font-normal text-lightGrey"
            >
              Fill in your details to access all features.
            </CommonParagraph>
          </div>

          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            className="w-full h-full"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div className="flex flex-col justify-center items-center xl:gap-8 gap-4 mx-auto">
                {/* Profile Image Upload */}
                <div className="w-full flex justify-center mb-2">
                  <div className="relative group">
                    <div
                      className={`xl:w-24 xl:h-24 w-20 h-20 rounded-full border-2 ${
                        previewImage
                          ? "border-solid border-mediumGrey"
                          : "border-dashed border-lightBlack"
                      } bg-mediumBlack flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out `}
                    >
                      {previewImage ? (
                        <>
                          <img
                            src={previewImage}
                            alt="Profile preview"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
                          />
                          <div className="absolute inset-0 bg-transparent bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 rounded-full">
                            <FaCamera className="text-white text-3xl shadow-2xl" />
                          </div>
                        </>
                      ) : (
                        <FaCamera className="text-mediumGrey text-2xl transition-transform duration-300 group-hover:text-mediumBlue group-hover:scale-125" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Upload profile image"
                    />
                  </div>
                </div>

                <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-5">
                  <InputField
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    register={register}
                    register_as="firstname"
                    errors={errors}
                    validationRules={{
                      required: "First name is required!",
                      pattern: {
                        value: /.*[a-zA-Z].*/,
                        message: "Must contain at least one letter",
                      },
                      validate: (value) =>
                        value.trim() !== "" || "First name cannot be empty",
                    }}
                    autoComplete="first_name"
                  />
                  <InputField
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    register={register}
                    register_as="last_name"
                    errors={errors}
                    validationRules={{
                      required: "Last name is required!",
                      pattern: {
                        value: /.*[a-zA-Z].*/,
                        message: "Must contain at least one letter",
                      },
                      validate: (value) =>
                        value.trim() !== "" || "Last name cannot be empty",
                    }}
                    autoComplete="last_name"
                  />
                </div>

                {/* Phone Number Field with Country Code */}
                <div className="w-full">
                  <div className="flex flex-col">
                    <div className="relative flex xs:flex-row flex-col gap-2">
                      <div className="lg:w-48 md:w-40 xs:w-36 w-full mr-2">
                        <CountryDropdown
                          atLeft={true}
                          options={countryCode}
                          placeholder="Select Country"
                          defaultValue="USA"
                          onChange={handleCountryChange}
                          variant="bg_black"
                          formInput={true}
                        />
                      </div>

                      <div className="relative flex-1">
                        <div className="absolute left-3 top-3 transform z-10">
                          <span className="text-sm text-mediumBlue font-semibold xl:text-base">
                            {countryCode.find(
                              (country) => country.value === selectedCountry,
                            )?.code || "+1"}
                          </span>
                        </div>
                        <InputField
                          name="phone_number"
                          type="tel"
                          placeholder="Phone Number"
                          register={register}
                          register_as="phone_number"
                          errors={errors}
                          validationRules={{
                            required: "Phone number is required!",
                            pattern: {
                              value: /^[0-9]{6,15}$/,
                              message: "Enter a valid number",
                            },
                          }}
                          phone={true}
                          autoComplete="tel"
                          showLabel={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <InputField
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  validationRules={{
                    required: "Email is required!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  register={register}
                  register_as="email"
                  errors={errors}
                  autoComplete="email"
                />

                <InputField
                  name="username"
                  type="text"
                  placeholder="Username"
                  register={register}
                  register_as="username"
                  errors={errors}
                  validationRules={{
                    required: "Username is required!",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
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

                <div className="w-full">
                  <CountryDropdown
                    atLeft={true}
                    options={createOptions}
                    placeholder="How did you hear about us?"
                    defaultValue={selectedOption}
                    onChange={handleOptionChange}
                    variant="bg_black"
                    formInput={true}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full mt-5 xl:mb-8 mb-6">
                {/* Terms and Policy Checkbox */}
                <div className="flex xs:items-center items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setChecked(!checked)}
                    className={`relative min-w-5 min-h-5 border-2 rounded-sm flex justify-center items-center shadow transition-all duration-300 cursor-pointer 2xs:mt-0 mt-0.5 ${
                      checked ? "border-mediumBlue" : "border-mediumGrey"
                    }`}
                  >
                    {checked && (
                      <motion.div
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute w-[14px] h-[14px] flex items-center justify-center"
                      >
                        <GiCheckMark className="text-mediumBlue w-full h-full" />
                      </motion.div>
                    )}
                  </button>

                  <CommonParagraph
                    variant="small"
                    className="font-normal text-mediumGrey"
                  >
                    I agree to Tech Takes{" "}
                    <Link
                      to="/terms-and-conditions"
                      className="text-lightGrey underline hover:text-mediumBlue"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-lightGrey underline hover:text-mediumBlue"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </CommonParagraph>
                </div>

                {/* Marketing Emails Checkbox */}
                <div className="flex xs:items-center items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setMarketingChecked(!marketingChecked)}
                    className={`relative min-w-5 min-h-5 border-2 rounded-sm flex justify-center items-center shadow transition-all duration-300 cursor-pointer 2xs:mt-0 mt-0.5 lg:mb-3 ${
                      marketingChecked
                        ? "border-mediumBlue"
                        : "border-mediumGrey"
                    }`}
                  >
                    {marketingChecked && (
                      <motion.div
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute w-[14px] h-[14px] flex items-center justify-center"
                      >
                        <GiCheckMark className="text-mediumBlue w-full h-full " />
                      </motion.div>
                    )}
                  </button>

                  <CommonParagraph
                    variant="small"
                    className="font-normal text-mediumGrey"
                  >
                    I agree to receive marketing emails from Tech Takes,
                    including news, updates, and special offers. I understand
                    that I can unsubscribe at any time.
                  </CommonParagraph>
                </div>
              </div>

              <div className="w-full">
                <SubmitButton
                  type="submit"
                  variant="bg_blue"
                  isLoading={isPending}
                  loadingText="Signing Up"
                  disabled={isPending || !checked}
                >
                  Continue
                </SubmitButton>
              </div>
            </form>
            <div className="text-center flex justify-center mt-3">
              <CommonParagraph className="font-normal text-lightGrey ">
                {"Already have an account?"}
                <Link
                  to={"/sign-in"}
                  className="text-greenDark hover:text-greenExtraDark font-semibold"
                >
                  {" "}
                  <span className="text-mediumBlue font-medium cursor-pointer">
                    {" "}
                    Sign In
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

export default SignUp;
