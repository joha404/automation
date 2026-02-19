import React, { useState } from "react";
import { X, AlertCircle, Sparkles } from "lucide-react";

const ClaimPromoCodePopUp = ({
  isOpen,
  onClose,
  promoCode,
  discountValue,
  validFrom,
  validUntil,
  onConfirm,
  isLoading = false,
  modalOverlayClass = "bg-black/50",
  modalBgClass = "bg-white",
  textClass = "text-gray-900",
  mutedTextClass = "text-gray-600",
  borderClass = "border-gray-200",
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalOverlayClass} backdrop-blur-sm animate-fadeIn`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md ${modalBgClass} rounded-2xl shadow-2xl border ${borderClass} overflow-hidden animate-slideUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 active:scale-95"
          }`}
        >
          <X className={`w-5 h-5 ${mutedTextClass}`} />
        </button>

        {/* Content */}
        <div className="relative p-6 pt-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse" /> */}
              {/* <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div> */}
            </div>
          </div>

          {/* Title */}
          <h2
            className={`text-xl lg:text-2xl font-bold text-center mb-1 lg:mb-2 ${textClass} bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600`}
          >
            Claim Promo Code
          </h2>

          <p
            className={`text-center ${mutedTextClass} mb-6 text-xs lg:text-sm`}
          >
            Are you sure you want to claim this promotional code?
          </p>

          {/* Promo Details Card */}
          <div
            className={`${modalBgClass}  ${borderClass}  rounded-xl p-4 mb-6 `}
          >
            {/* Validity Period */}
            {validFrom && validUntil && (
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-purple-200 dark:border-purple-800">
                <span className={`text-xs ${mutedTextClass}`}>
                  Valid Period
                </span>
                <span className={`text-xs font-medium ${textClass}`}>
                  {formatDate(validFrom)} - {formatDate(validUntil)}
                </span>
              </div>
            )}

            {/* Promo Code */}
            <div
              className={`flex justify-between items-center mb-3 ${modalBgClass}`}
            >
              <span className={`text-sm font-medium ${mutedTextClass}`}>
                Promo Code
              </span>
              <code
                className={`text-lg font-bold font-mono ${textClass} ${modalBgClass}  dark:bg-gray-800 px-3 py-1 rounded-lg border ${borderClass}`}
              >
                {promoCode}
              </code>
            </div>

            {/* Discount Value */}
            {discountValue && (
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${mutedTextClass}`}>
                  Discount
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {Math.floor(discountValue)}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Warning Note */}
          <div className="flex gap-2 p-2 lg:p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-6 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] lg:text-xs text-amber-800 dark:text-amber-200">
              Once claimed, this promo code will be activated and cannot be
              unclaimed. Make sure to use it before the expiry date.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 px-2 cursor-pointer py-2 lg:px-4 lg:py-3 rounded-md lg:rounded-xl font-semibold text-[12px] lg:text-sm transition-all duration-200 ${
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
              }`}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-2 cursor-pointer py-2 lg:px-4 lg:py-3 rounded-md lg:rounded-xl font-semibold text-[12px] lg:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-95 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Claim</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ClaimPromoCodePopUp;
