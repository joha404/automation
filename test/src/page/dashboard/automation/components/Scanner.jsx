import CommonWrapper from "@/components/wrappers/CommonWrapper";
import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/custom/useTheme";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { usePost } from "@/hooks/api/common/usePost";
import successToast from "@/hooks/custom/successToast";
import { GiCheckMark } from "react-icons/gi";

const Scanner = ({ activeTab, setActiveTab }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  const { theme } = useTheme();

  const {
    data: response,
    isLoading: walletLoading,
    refetch: walletRefetch,
  } = useGet("/wallets/", {
    queryKey: ["wallet-qr"],
    secure: true,
  });

  const qr = response?.data[0] || {};

  const {
    data: deposit_status,
    isLoading: depositLoading,
    refetch: depositRefetch,
  } = useGet("/deposits/latest/status/", {
    queryKey: ["deposits"],
    secure: true,
  });

  const dstatus = deposit_status?.data || {};

  const {
    data: withdraw_status,
    isLoading: withdrawLoading,
    refetch: withdrawRefetch,
  } = useGet("/withdrawals/latest/status/", {
    queryKey: ["withdrawals"],
    secure: true,
  });

  const wStatus = withdraw_status?.data || {};

  // Deposit mutation
  const depositMutation = usePost("/deposits/", {
    secure: true,
  });

  // Withdrawal mutation
  const withdrawMutation = usePost("/withdraw/start/", {
    secure: true,
  });

  const handleSendCode = () => {
    if (activeTab === "deposit") {
      const depositData = {
        wallet_currency_name: 1,
        user_wallet_address: depositAddress,
        amount: depositAmount,
        accept_conditions: checked,
        us_risk: checked2,
        non_us_risk: checked3,
      };
      depositMutation.mutate(depositData, {
        onSuccess: (data) => {
          successToast("Deposit Sucessful!");
          depositRefetch();
          walletRefetch();
          setDepositAmount("");
          setDepositAddress("");
          setChecked(false);
          setChecked2(false);
          setChecked3(false);
        },
      });
    } else {
      const withdrawData = {
        wallet_currency_name: "USDT",
        user_wallet_address: withdrawAddress,
        amount: withdrawAmount,
      };
      withdrawMutation.mutate(withdrawData, {
        onSuccess: (data) => {
          successToast("Withdrawl Sucessful!");
          setWithdrawAmount("");
          setWithdrawAddress("");
        },
      });
    }
  };

  const renderStatusMessage = (statusObj) => {
    if (!statusObj) return "";
    if (typeof statusObj === "string") return statusObj;
    if (
      statusObj.status_message &&
      typeof statusObj.status_message === "string"
    ) {
      return statusObj.status_message;
    }
    if (statusObj.user_wallet_address) {
      return statusObj.user_wallet_address;
    }
    return JSON.stringify(statusObj);
  };

  if (walletLoading || depositLoading || withdrawLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="bottomSection">
      <div
        className={`rounded-xl font-primary sm:p-5 p-3 shadow-sm border ${
          theme === "dark"
            ? "bg-darkBlack border-mediumBlack"
            : "bg-white border-lightestGrey"
        }`}
      >
        <div className="mx-auto">
          <div>
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
                <div className="relative w-auto">
                  <div
                    className={`relative rounded-full shadow-lg transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 shadow-gray-900/30"
                        : "bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-gray-900/10"
                    }`}
                  >
                    <div className="relative flex rounded-xl">
                      <button
                        className={`cursor-pointer relative px-6 sm:px-8 py-2 sm:py-3 text-sm font-semibold z-10 transition-all duration-300 rounded-xl ${
                          activeTab === "deposit"
                            ? "text-white transform"
                            : theme === "dark"
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => setActiveTab("deposit")}
                      >
                        <span className="relative z-10">Deposit</span>
                        {activeTab === "deposit" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </button>

                      <button
                        className={`cursor-pointer relative px-6 sm:px-8 py-2 sm:py-3 text-sm font-semibold z-10 transition-all duration-300 rounded-xl ${
                          activeTab === "withdraw"
                            ? "text-white transform"
                            : theme === "dark"
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => setActiveTab("withdraw")}
                      >
                        <span className="relative z-10">Withdraw</span>
                        {activeTab === "withdraw" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === "deposit" ? (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Select Coin
                  </label>
                  <div className="relative">
                    <div
                      className={`w-full ${
                        theme === "dark"
                          ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                          : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                      } border rounded-lg pl-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {qr.wallet_name || "USDT"}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex justify-center items-center rounded-md mt-3 ${
                    theme === "dark"
                      ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                      : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                  }`}
                >
                  <div className="inline-block">
                    {qr?.wallet_qr ? (
                      <>
                        {dstatus?.status === "Pending" ||
                        dstatus?.status === "Completed" ||
                        dstatus?.status === "Canceled" ? (
                          <div className="m-3 xl:w-40 xl:h-40 w-32 h-32 bg-white border-2 border-mediumBlue rounded-xl relative overflow-hidden shadow-lg mx-auto">
                            <img
                              src={qr?.wallet_qr}
                              alt="Company Deposit QR / Address"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative overflow-hidden shadow-lg mx-auto"></div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center items-center xl:h-40 h-32 relative overflow-hidden shadow-lg mx-auto">
                        <CommonParagraph>
                          Company Deposit QR / Address
                        </CommonParagraph>
                      </div>
                    )}
                  </div>
                </div>

                {dstatus?.status === "Pending" ||
                dstatus?.status === "Completed" ||
                dstatus?.status === "Canceled" ? (
                  <>
                    <div
                      className={`rounded-lg p-4 mt-4 text-left ${
                        theme === "dark" ? "bg-darkerBlack" : "bg-gray-50"
                      }`}
                    >
                      <CommonParagraph
                        variant="smaller"
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Deposits are now locked to :{" "}
                        {qr?.wallet_address || "not available"}
                      </CommonParagraph>
                    </div>

                    {dstatus?.status === "Pending" && (
                      <div
                        className={`mt-5 ${
                          theme === "dark"
                            ? "bg-amber-900/30 border-amber-700"
                            : "bg-amber-50 border-amber-200"
                        } border rounded-lg p-4`}
                      >
                        <div className="flex items-start space-x-3">
                          <div>
                            <CommonParagraph
                              variant="small"
                              className={`${
                                theme === "dark"
                                  ? "text-amber-300"
                                  : "text-amber-800"
                              } font-normal mb-1`}
                            >
                              {renderStatusMessage(dstatus)}
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>
                    )}

                    {dstatus?.status === "Completed" && (
                      <div
                        className={`mt-5 ${
                          theme === "dark"
                            ? "bg-emerald-900/30 border-emerald-700"
                            : "bg-emerald-50 border-emerald-200"
                        } border rounded-lg p-4`}
                      >
                        <div className="flex items-start space-x-3">
                          <div>
                            <CommonParagraph
                              variant="small"
                              className={`${
                                theme === "dark"
                                  ? "text-emerald-300"
                                  : "text-emerald-800"
                              } font-normal mb-1`}
                            >
                              {renderStatusMessage(dstatus)}
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>
                    )}

                    {dstatus?.status === "Canceled" && (
                      <div
                        className={`mt-5 ${
                          theme === "dark"
                            ? "bg-rose-900/30 border-rose-700"
                            : "bg-rose-50 border-rose-200"
                        } border rounded-lg p-4`}
                      >
                        <div className="flex items-start space-x-3">
                          <div>
                            <CommonParagraph
                              variant="small"
                              className={`${
                                theme === "dark"
                                  ? "text-rose-300"
                                  : "text-rose-800"
                              } font-normal mb-1`}
                            >
                              {renderStatusMessage(dstatus)}
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-1`}
                        >
                          Amount Deposited (USDT)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={depositAmount}
                            placeholder="e.g. 250"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d+$/.test(value)) {
                                setDepositAmount(value);
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className={`w-full ${
                              theme === "dark"
                                ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                                : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                            } border rounded-lg pl-4 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-1`}
                        >
                          From Wallet Address
                        </label>
                        <input
                          type="text"
                          value={depositAddress}
                          placeholder="Enter wallet address"
                          onChange={(e) => setDepositAddress(e.target.value)}
                          className={`w-full ${
                            theme === "dark"
                              ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                              : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                          } border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setChecked(!checked)}
                          className={`relative w-5 h-5 border-2 rounded-sm flex justify-center items-center shadow transition-all duration-300 cursor-pointer ${
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
                          variant="smaller"
                          className="font-normal"
                        >
                          I confirm that use of this service is legal in my
                          jurisdiction.
                        </CommonParagraph>
                      </div>

                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => setChecked2(!checked2)}
                          className={`relative 
      w-5 h-5
      sm:w-6 sm:h-6
      lg:w-5 lg:h-5
      border-2 rounded-sm
      flex items-center justify-center
      shadow transition-all duration-300
      cursor-pointer shrink-0
      ${checked2 ? "border-mediumBlue" : "border-mediumGrey"}
    `}
                        >
                          {checked2 && (
                            <motion.div
                              initial={{ clipPath: "inset(0 100% 0 0)" }}
                              animate={{ clipPath: "inset(0 0% 0 0)" }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="flex items-center justify-center"
                            >
                              <GiCheckMark
                                className="
            text-mediumBlue
            w-3 h-3
            sm:w-4 sm:h-4
            lg:w-5 lg:h-5
          "
                              />
                            </motion.div>
                          )}
                        </button>

                        <CommonParagraph
                          variant="smaller"
                          className="font-normal leading-relaxed"
                        >
                          I acknowledge that Ultimate Automation is strictly
                          unavailable to customers in certain jurisdictions
                          (Please see Terms of Service & Risk Disclosure
                          Statement.)
                        </CommonParagraph>
                      </div>

                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => setChecked3(!checked3)}
                          className={`relative 
      w-5 h-5
      sm:w-6 sm:h-6
      lg:w-5 lg:h-5
      border-2 rounded-sm
      flex items-center justify-center
      shadow transition-all duration-300
      cursor-pointer shrink-0
      ${checked3 ? "border-mediumBlue" : "border-mediumGrey"}
    `}
                        >
                          {checked3 && (
                            <motion.div
                              initial={{ clipPath: "inset(0 100% 0 0)" }}
                              animate={{ clipPath: "inset(0 0% 0 0)" }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="flex items-center justify-center"
                            >
                              <GiCheckMark
                                className="
            text-mediumBlue
            w-3 h-3
            sm:w-4 sm:h-4
            lg:w-5 lg:h-5
          "
                              />
                            </motion.div>
                          )}
                        </button>

                        <CommonParagraph
                          variant="smaller"
                          className="
      font-normal
      text-xs
      sm:text-sm
      lg:text-base
      leading-relaxed
    "
                        >
                          I understand that misrepresentation may result in
                          immediate termination and loss of access.
                        </CommonParagraph>
                      </div>

                      {depositAddress && (
                        <div
                          className={`rounded-lg p-4 mt-4 text-left ${
                            theme === "dark" ? "bg-darkerBlack" : "bg-gray-50"
                          }`}
                        >
                          <CommonParagraph
                            variant="smaller"
                            className={`${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Note: After submitting, your account will be locked
                            to this wallet for future deposits:
                            <br />
                            <span className="font-mono text-blue-500 break-all">
                              {depositAddress}
                            </span>
                          </CommonParagraph>
                        </div>
                      )}

                      <button
                        onClick={handleSendCode}
                        disabled={
                          depositMutation.isPending ||
                          !checked ||
                          !checked2 ||
                          !checked3
                        }
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {depositMutation.isPending
                          ? "Submitting..."
                          : "Submit Deposit"}
                      </button>
                    </div>

                    <div
                      className={`mt-5 ${
                        theme === "dark"
                          ? "bg-amber-900/30 border-amber-700"
                          : "bg-amber-50 border-amber-200"
                      } border rounded-lg p-4`}
                    >
                      <div className="flex items-start space-x-3">
                        <FaExclamationTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <CommonParagraph
                            variant="smaller"
                            className={`${
                              theme === "dark"
                                ? "text-amber-300"
                                : "text-amber-800"
                            } font-normal mb-1`}
                          >
                            Important: Send only USDT to the displayed address.
                            Depositing other assets may lead to loss of funds.
                          </CommonParagraph>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <CommonParagraph
                  variant="smaller"
                  className={`w-full text-center mt-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Reminder: Our enterprise wallet will only accept USDT on ETH
                  network <br />
                  Your unit size does not change based on wins or losses — it
                  only changes if you make a new deposit and your total deposit
                  amount increases.
                </CommonParagraph>
              </>
            ) : (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Select Coin
                  </label>
                  <div className="relative">
                    <div
                      className={`w-full ${
                        theme === "dark"
                          ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                          : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                      } border rounded-lg pl-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {qr.wallet_name || "USDT"}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex justify-center items-center p-2 rounded-md mt-3 mb-5 ${
                    theme === "dark"
                      ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                      : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                  }`}
                >
                  <div className="inline-block p-3">
                    {qr?.wallet_qr_withdrawl ? (
                      <div className="xl:w-40 xl:h-40 w-32 h-32 bg-white border-2 border-mediumBlue rounded-xl relative overflow-hidden shadow-lg mx-auto">
                        <img
                          src={qr?.wallet_qr}
                          alt="Company Deposit QR / Address"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-20 relative overflow-hidden mx-auto">
                        <CommonParagraph className="font-medium">
                          Withdrawal desk runs compliance <br /> checks before
                          funds are released.
                        </CommonParagraph>
                      </div>
                    )}
                  </div>
                </div>

                {wStatus?.status === "Pending" ||
                wStatus?.status === "Completed" ||
                wStatus?.status === "Canceled" ? (
                  <>
                    <div
                      className={`rounded-lg p-4 mt-4 text-left ${
                        theme === "dark" ? "bg-darkerBlack" : "bg-gray-50"
                      }`}
                    >
                      <CommonParagraph
                        variant="smaller"
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Withdrawals will be sent to your locked wallet:
                        0xTT-LOCK-9F72AA129B :{" "}
                        {qr?.wallet_address || "not available"}
                      </CommonParagraph>
                    </div>

                    {wStatus?.status === "Pending" && (
                      <div
                        className={`mt-5 ${
                          theme === "dark"
                            ? "bg-amber-900/30 border-amber-700"
                            : "bg-amber-50 border-amber-200"
                        } border rounded-lg p-4`}
                      >
                        <div className="flex items-start space-x-3">
                          <div>
                            <CommonParagraph
                              variant="small"
                              className={`${
                                theme === "dark"
                                  ? "text-amber-300"
                                  : "text-amber-800"
                              } font-normal mb-1`}
                            >
                              {renderStatusMessage(wStatus)}
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>
                    )}

                    {wStatus?.status === "Completed" && (
                      <div
                        className={`mt-5 ${
                          theme === "dark"
                            ? "bg-emerald-900/30 border-emerald-700"
                            : "bg-emerald-50 border-emerald-200"
                        } border rounded-lg p-4`}
                      >
                        <div className="flex items-start space-x-3">
                          <div>
                            <CommonParagraph
                              variant="small"
                              className={`${
                                theme === "dark"
                                  ? "text-emerald-300"
                                  : "text-emerald-800"
                              } font-normal mb-1`}
                            >
                              {renderStatusMessage(wStatus)}
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>
                    )}

                    {wStatus?.status === "Canceled" && (
                      <div
                        className={`mt-5 ${
                          theme === "dark"
                            ? "bg-rose-900/30 border-rose-700"
                            : "bg-rose-50 border-rose-200"
                        } border rounded-lg p-4`}
                      >
                        <div className="flex items-start space-x-3">
                          <div>
                            <CommonParagraph
                              variant="small"
                              className={`${
                                theme === "dark"
                                  ? "text-rose-300"
                                  : "text-rose-800"
                              } font-normal mb-1`}
                            >
                              {renderStatusMessage(wStatus)}
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-1`}
                        >
                          Withdrawal Amount (USDT)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={withdrawAmount}
                            placeholder="e.g. 300"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d+$/.test(value)) {
                                setWithdrawAmount(value);
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className={`w-full ${
                              theme === "dark"
                                ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                                : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                            } border rounded-lg pl-4 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-1`}
                        >
                          Destination Wallet Address
                        </label>
                        <input
                          type="text"
                          placeholder="Enter the wallet on file"
                          value={withdrawAddress}
                          onChange={(e) => setWithdrawAddress(e.target.value)}
                          className={`w-full ${
                            theme === "dark"
                              ? "bg-lightBlack/20 border-lightBlack/50 text-white"
                              : "bg-lighterGrey/20 border-lighterGrey/50 text-gray-900"
                          } border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>

                      <button
                        onClick={handleSendCode}
                        disabled={withdrawMutation.isPending}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {withdrawMutation.isPending
                          ? "Submitting..."
                          : "Submit Withdrawal"}
                      </button>
                    </div>

                    {/* Important Notice */}
                    <div
                      className={`rounded-lg p-4 mt-4 text-left ${
                        theme === "dark" ? "bg-darkerBlack" : "bg-gray-50"
                      }`}
                    >
                      <CommonParagraph
                        variant="smaller"
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Reminder: You should only receive money into the wallet
                        locked with your account. 0xTT-LOCK-9F72AA129B
                      </CommonParagraph>
                    </div>

                    {/* Warning Section */}
                    <div
                      className={`mt-3 ${
                        theme === "dark"
                          ? "bg-amber-900/30 border-amber-700"
                          : "bg-amber-50 border-amber-200"
                      } border rounded-lg p-4`}
                    >
                      <div className="flex items-start space-x-3">
                        <FaExclamationTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <CommonParagraph
                            variant="smaller"
                            className={`${
                              theme === "dark"
                                ? "text-amber-300"
                                : "text-amber-800"
                            } font-normal mb-1`}
                          >
                            Funds can not be redirected once released.
                            Double-check the wallet address above before
                            submitting.
                          </CommonParagraph>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Scanner;
