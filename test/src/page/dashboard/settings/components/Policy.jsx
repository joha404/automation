import { useTheme } from "@/hooks/custom/useTheme";
import { motion } from "framer-motion";
import { HiOutlineDocumentText, HiOutlineShieldCheck } from "react-icons/hi";

const Policy = () => {
  const { theme } = useTheme();

  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const mutedTextClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-[#054844]" : "bg-white";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverClass =
    theme === "dark" ? "hover:bg-[#023c38]" : "hover:bg-gray-100";

  const policies = [
    {
      id: 1,
      title: "Terms & Conditions",
      description: "Review our terms of service and user agreement",
      icon: HiOutlineDocumentText,
      link: "/terms-and-conditions",
      iconColor: theme === "dark" ? "text-blue-400" : "text-blue-600",
    },
    {
      id: 2,
      title: "Privacy Policy",
      description: "Learn how we protect and handle your data",
      icon: HiOutlineShieldCheck,
      link: "/privacy-policy",
      iconColor: theme === "dark" ? "text-purple-400" : "text-purple-600",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0A9087] font-logo">
            Hyper Picks Compliance
          </h1>
          <p className="text-lg font-logo text-white">
            Review our terms, privacy practices, and automation guidelines
          </p>
        </motion.div>

        {/* Policy Cards — flex + justify-center fixes odd card alignment */}
        <div className="flex flex-wrap justify-center gap-6">
          {policies.map((policy, index) => {
            const Icon = policy.icon;

            return (
              <motion.a
                key={policy.id}
                href={policy.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative p-6 w-full sm:w-72 flex flex-col justify-center items-center rounded-xl border ${borderClass} ${cardBg} transition-all duration-300 ${hoverClass}`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                    theme === "dark" ? "bg-black" : "bg-gray-100"
                  }`}
                >
                  <Icon className={`w-8 h-8 ${policy.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 ${textClass}`}>
                  {policy.title}
                </h3>

                {/* Description */}
                <p className={`text-sm text-center ${mutedTextClass}`}>
                  {policy.description}
                </p>

                {/* View Details */}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#0A9087] group-hover:gap-2 transition-all duration-300">
                  <span>View Details</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Policy;
