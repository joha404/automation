import Logo from "@/components/svgs/Logo";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const Terms = () => {
  const { data: terms, isLoading: termsLoading } = useGet(
    "/legal/terms/current/",
    {
      queryKey: ["terms"],
      secure: false,
    },
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      <style>{`
        .legal-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #3B82F6;
        }
        
        .legal-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #60A5FA;
        }
        
        .legal-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: #E5E7EB;
        }
        
        .legal-content strong {
          font-weight: 600;
          color: #F3F4F6;
        }
        
        .legal-content ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          list-style-type: disc;
        }
        
        .legal-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
          color: #E5E7EB;
        }
        
        .legal-content hr {
          border: 0;
          border-top: 1px solid #374151;
          margin: 1.5rem 0;
        }
        
        .legal-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background-color: #1F2937;
          border-radius: 0.5rem;
          overflow: hidden;
          table-layout: fixed;
        }
        
        .legal-content figure.table {
          width: 100%;
          margin: 0;
        }
        
        .legal-content thead {
          background-color: #374151;
        }
        
        .legal-content th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #F3F4F6;
          border-bottom: 2px solid #4B5563;
        }
        
        .legal-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #374151;
          color: #E5E7EB;
        }
        
        .legal-content tbody tr:last-child td {
          border-bottom: none;
        }
        
        .legal-content tbody tr:hover {
          background-color: #374151;
        }
        
        .legal-content figure {
          margin: 1.5rem 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          width: 100%;
        }

        .table-wrapper::-webkit-scrollbar {
          height: 8px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        
        @media (max-width: 768px) {
          .legal-content h1 {
            font-size: 16px;
          }
          
          .legal-content h2 {
            font-size: 14px;
          }
          
          .legal-content p {
            font-size: 12px;
          }
          
          .legal-content li {
            font-size: 12px;
          }
          
          .legal-content table {
            font-size: 12px;
            min-width: 600px;
            table-layout: auto;
          }
          
          .legal-content th,
          .legal-content td {
            padding: 0.5rem;
            white-space: nowrap;
          }
        }
        
        @media (min-width: 769px) {
          .legal-content th:first-child,
          .legal-content td:first-child {
            width: 35%;
          }
          
          .legal-content th:nth-child(2),
          .legal-content td:nth-child(2) {
            width: 25%;
          }
          
          .legal-content th:nth-child(3),
          .legal-content td:nth-child(3) {
            width: 40%;
          }
        }
        
        .legal-content a {
          color: #3B82F6;
          text-decoration: underline;
        }
        
        .legal-content a:hover {
          color: #60A5FA;
        }

        .legal-content img {
          display: inline;
          vertical-align: middle;
        }
      `}</style>

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

              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm text-gray-400">
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
                      ? formatDate(termsData.effective_date)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#054844] rounded-lg p-6 md:p-8">
              <div
                className="legal-content break-words"
                dangerouslySetInnerHTML={{
                  __html: termsData.content?.replace(
                    /<figure class="table">(.*?)<\/figure>/gs,
                    '<div class="table-wrapper"><figure class="table">$1</figure></div>',
                  ),
                }}
              />
            </div>

            {/* Footer Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Last updated:{" "}
                {termsData.updated_at ? formatDate(termsData.updated_at) : "-"}
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
