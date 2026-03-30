import Logo from "@/components/svgs/Logo";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import {
  formatLegalDate,
  LEGAL_CONTENT_STYLES,
  prepareLegalContent,
} from "@/shared/legalContent";

const Terms = () => {
  const { data: terms, isLoading: termsLoading } = useGet(
    "/legal/terms/current/",
    {
      queryKey: ["terms"],
      secure: false,
    },
  );

  const termsData = terms?.data || {};

  if (termsLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021716] text-white">
      <style>{LEGAL_CONTENT_STYLES}</style>

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="md:p-5 lg:p-10 w-full max-w-7xl">
            {/* Header Section */}
            <div className="text-center mx-auto mb-10">
              <div className="flex justify-center items-center mb-8">
                <Logo />
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-logo mb-4 text-[#0A9087]">
                {termsData.title || "Terms & Conditions"}
              </h1>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm text-[#9BC5C0]">
                <div className="flex items-center gap-2 font-logo">
                  <span className="font-medium text-[#0A9087]">Version:</span>
                  <span>{termsData.version || "-"}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
                <div className="flex items-center font-logo gap-2">
                  <span className="font-medium text-[#0A9087]">
                    Effective Date:
                  </span>
                  <span>
                    {termsData.effective_date
                      ? formatLegalDate(termsData.effective_date)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#12766F]/30 bg-[#054844] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-8">
              <div
                className="legal-content break-words"
                dangerouslySetInnerHTML={{
                  __html: prepareLegalContent(termsData.content),
                }}
              />
            </div>

            {/* Footer Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Last updated:{" "}
                {termsData.updated_at
                  ? formatLegalDate(termsData.updated_at)
                  : "-"}
              </p>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-[#0A9087] text-white rounded-lg cursor-pointer hover:bg-[#08726C] transition-all duration-300 font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
