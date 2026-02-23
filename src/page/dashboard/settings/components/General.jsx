import successToast from "@/hooks/custom/successToast";
import { setToken, setUser } from "@/redux/features/user/userSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import CommonParagraph from "@/components/texts/CommonParagraph";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/buttons/SubmitButton";
import { FaCamera } from "react-icons/fa";
import countryCode from "@/hooks/custom/countryCode";
import errorToast from "@/hooks/custom/errorToast";
import { useTheme } from "@/hooks/custom/useTheme";
import { usePut } from "@/hooks/api/common/usePut";

const General = () => {
  const user = useSelector((state) => state.user.user);
  const [selectedCountry, setSelectedCountry] = useState(user?.country);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dispatch = useDispatch();

  console.log(user?.country);
  const extractPhoneNumber = (phoneWithCode) => {
    if (!phoneWithCode) return "";
    const phoneCode = countryCode[user?.country || "Austria"] || "+880";
    return phoneWithCode.replace(phoneCode, "");
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      firstname: user?.first_name || "",
      lastname: user?.last_name || "",
      email: user?.email || "",
      phone: extractPhoneNumber(user?.phone_number) || "",
      username: user?.username || "",
      profileImage: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("email", user.email || "");
      setValue("username", user.username || "");
      setValue("phone", extractPhoneNumber(user.phone_number) || "");

      if (user.country) {
        setSelectedCountry(user.country);
      }
      if (user.profile_img_url) {
        setPreviewImage(user.profile_img_url);
      }
    }
  }, [user, setValue]);

  const { mutate: updateProfile, isPending } = usePut("/profile/", {
    secure: true,
    isFileUpload: true,
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setValue("profileImage", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (countryValue) => {
    setSelectedCountry(countryValue);
  };

  const onSubmit = (data) => {
    const phoneCode = countryCode[selectedCountry] || "+880";

    const formData = new FormData();
    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);
    formData.append("email", data.email);
    formData.append("username", data.username);

    // ✅ Add dynamic phone code
    formData.append("phone_number", `${phoneCode}${data.phone}`);
    formData.append("country", selectedCountry);

    if (profileImage) {
      formData.append("profile_img_url", profileImage);
      formData.append("profile_img", profileImage);
    }

    updateProfile(formData, {
      onSuccess: (response) => {
        console.log(response);
        successToast(response?.message || "Profile updated successfully!");
        const updatedUser = {
          ...user,
          ...response?.data,
        };
        dispatch(setUser(updatedUser));
      },
      onError: (error) => {
        errorToast(error?.message || "Failed to update profile");
      },
    });
  };

  return (
    <div className={`flex items-center justify-center`}>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-2xl overflow-hidden lg:space-x-6">
        {/* Left Box - Image Upload */}
        <div
          className={`w-full lg:w-2/5 p-10 flex flex-col items-center justify-center rounded-2xl shadow-xl ${
            theme === "dark" ? "bg-[#054844]" : "bg-white"
          } mb-6`}
        >
          <div className="w-full flex flex-col items-center xlg:py-20">
            <div className="relative group mb-6">
              <div
                className={`xl:w-40 xl:h-40 w-36 h-36 rounded-full border-2 ${
                  previewImage
                    ? "border-solid border-mediumGrey"
                    : "border-dashed border-lightBlack"
                } ${
                  theme === "dark" ? "bg-[#01312e]" : "bg-lighterGrey"
                } flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out`}
              >
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
                    />
                    {/* Camera overlay on hover */}
                    <div className="absolute inset-0 bg-transparent bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 rounded-full">
                      <FaCamera className="text-white text-3xl shadow-2xl" />
                    </div>
                  </>
                ) : (
                  <FaCamera
                    className={`text-mediumGrey text-4xl transition-transform duration-300 group-hover:text-mediumBlue group-hover:scale-125`}
                  />
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

            <CommonParagraph
              variant="small"
              className={`text-center font-logo ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Click on the camera to upload a profile picture
            </CommonParagraph>

            <CommonParagraph
              variant="smaller"
              className={`text-center ${
                theme === "dark" ? "text-mediumGrey" : "text-lightGrey"
              }`}
            >
              JPG, PNG or GIF - Max 5MB
            </CommonParagraph>
          </div>
        </div>

        {/* Right Box - Form Fields */}
        <div
          className={`w-full lg:w-3/5 p-8 rounded-2xl shadow-xl ${
            theme === "dark" ? "bg-[#054844]" : "bg-white"
          } mb-6`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className=" xlg:py-20">
            <div className="grid md:grid-cols-2 md:gap-2 gap-5 mb-6">
              <InputField
                name="firstname"
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
                autoComplete="firstname"
                variant={theme === "dark" ? "bg_black" : "bg_white"}
                theme={theme}
              />
              <InputField
                name="lastname"
                type="text"
                placeholder="Last Name"
                register={register}
                register_as="lastname"
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
                autoComplete="lastname"
                variant={theme === "dark" ? "bg_black" : "bg_white"}
                theme={theme}
              />
            </div>
            <div className="grid md:grid-cols-2 md:gap-2 gap-5 mb-6 pointer-events-none opacity-70">
              <InputField
                name="country"
                type="text"
                placeholder="Country"
                value={
                  countryCode.find(
                    (country) => country.value === selectedCountry,
                  )?.label || "Country"
                }
                readOnly
                showLabel={false}
                variant={theme === "dark" ? "bg_black" : "bg_white"}
                theme={theme}
                disabled={true}
              />

              <div className="relative flex-1">
                <div className="absolute left-3 top-3 transform z-10">
                  <span className="text-sm text-[#0A9087] font-semibold xl:text-base">
                    {countryCode.find(
                      (country) => country.value === selectedCountry,
                    )?.code || "+00"}
                  </span>
                </div>
                <InputField
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  register={register}
                  register_as="phone"
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
                  variant={theme === "dark" ? "bg_black" : "bg_white"}
                  theme={theme}
                  disabled={true} // 🔒 make input read-only
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-2 gap-5 mb-6">
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
                variant={theme === "dark" ? "bg_black" : "bg_white"}
                theme={theme}
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
                variant={theme === "dark" ? "bg_black" : "bg_white"}
                theme={theme}
                disabled={true}
                className=" opacity-70"
              />
            </div>

            <div className="w-full flex xlg:justify-end items-end">
              <SubmitButton
                variant="bg_black"
                type="submit"
                isLoading={isPending}
                loadingText="Updating Profile"
                className="xlg:w-[250px] w-full"
              >
                Update Profile
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default General;
