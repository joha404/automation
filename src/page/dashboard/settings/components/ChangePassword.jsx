import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import PasswordField from "@/components/forms/PasswordField";
import SubmitButton from "@/components/buttons/SubmitButton";
import { FiCheckCircle, FiXCircle, FiLock } from "react-icons/fi";
import { useTheme } from "@/hooks/custom/useTheme";
import successToast from "@/hooks/custom/successToast";
import errorToast from "@/hooks/custom/errorToast";
import { usePost } from "@/hooks/api/common/usePost";

const ChangePassword = () => {
  const { theme } = useTheme();
  const [passwordChanged, setPasswordChanged] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  });

  // Use the usePost hook for password update
  const { mutate: updatePassword, isPending: isSubmitting } =
    usePost("/change-password/");

  const onSubmit = (data) => {
    // Prepare the data in the required format
    const passwordData = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_new_password: data.confirmPassword,
    };

    updatePassword(passwordData, {
      onSuccess: (response) => {
        successToast(response?.message || "Password updated successfully!");
        setPasswordChanged(true);
        reset();
      },
    });
  };

  const passwordValue = watch("newPassword", "");

  const passwordRequirements = [
    { id: 1, text: "At least 6 characters", met: passwordValue.length >= 6 },
    {
      id: 2,
      text: "Contains lowercase letter",
      met: /[a-z]/.test(passwordValue),
    },
    {
      id: 3,
      text: "Contains uppercase letter",
      met: /[A-Z]/.test(passwordValue),
    },
    { id: 4, text: "Contains number", met: /[0-9]/.test(passwordValue) },
    {
      id: 5,
      text: "Contains special character",
      met: /[^A-Za-z0-9]/.test(passwordValue),
    },
  ];

  return (
    <CommonWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Password Form Card */}
          <div className="lg:col-span-3">
            <div
              className={`rounded-xl shadow-sm border p-6 transition-colors duration-300
                ${
                  theme === "dark"
                    ? "bg-[#054844] border-mediumBlack"
                    : "bg-white border-gray-200"
                }`}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 py-10"
              >
                {/* Current Password */}
                <div>
                  <PasswordField
                    name="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    validationRules={{
                      required: "Current password is required!",
                    }}
                    register={register}
                    register_as="currentPassword"
                    errors={errors}
                    autoComplete="current-password"
                    variant={theme === "dark" ? "bg_black" : "bg_white"}
                  />
                </div>

                {/* New Password */}
                <div>
                  <PasswordField
                    name="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    validationRules={{
                      required: "New password is required!",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters!",
                      },
                      validate: (value) => {
                        if (
                          !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(
                            value,
                          )
                        ) {
                          return "Password must include uppercase, lowercase, number, and special character";
                        }
                        return true;
                      },
                    }}
                    register={register}
                    register_as="newPassword"
                    errors={errors}
                    autoComplete="new-password"
                    variant={theme === "dark" ? "bg_black" : "bg_white"}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <PasswordField
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    validationRules={{
                      required: "Please confirm your password!",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match!",
                    }}
                    register={register}
                    register_as="confirmPassword"
                    errors={errors}
                    autoComplete="new-password"
                    variant={theme === "dark" ? "bg_black" : "bg_white"}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <SubmitButton
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Updating Password"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Change Password
                  </SubmitButton>
                </div>
              </form>
            </div>
          </div>

          {/* Requirements Card */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-xl shadow-sm border p-6 h-full transition-colors duration-300
                ${
                  theme === "dark"
                    ? "bg-[#054844] border-mediumBlack"
                    : "bg-white border-gray-200"
                }`}
            >
              <CommonParagraph className="font-semibold mb-4">
                Password Requirements
              </CommonParagraph>

              <div className="space-y-3">
                <CommonParagraph
                  variant="small"
                  className={
                    theme === "dark" ? "text-lightGrey" : "text-gray-600 mb-4"
                  }
                >
                  For your security, please ensure your password meets the
                  following requirements:
                </CommonParagraph>

                <div className="space-y-2">
                  {passwordRequirements.map((req) => (
                    <div key={req.id} className="flex items-start gap-3">
                      {req.met ? (
                        <FiCheckCircle className="text-green-500 text-sm mt-0.5 flex-shrink-0" />
                      ) : (
                        <FiXCircle className="text-gray-400 text-sm mt-0.5 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          req.met
                            ? theme === "dark"
                              ? "text-green-400"
                              : "text-green-600"
                            : theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                        }`}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className={`pt-4 mt-4 border-t ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <CommonParagraph
                    variant="small"
                    className={
                      theme === "dark" ? "text-lightGrey" : "text-gray-600"
                    }
                  >
                    <strong>Tip:</strong> Use a unique password that you don't
                    use on other websites.
                  </CommonParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default ChangePassword;
