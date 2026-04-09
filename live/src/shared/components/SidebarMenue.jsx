import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SidebarMenu = ({
  items,
  isActive,
  theme,
  open,
  containerVariants,
  menuItemVariants,
  iconVariants,
  textVariants,
  animationKey,
  sectionName,
  title,
}) => {
  return (
    <div className={`${open ? "xl:mb-6 lg:mb-4 md:mb-2" : "mb-0"}`}>
      {/* Section Title */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <p
            className={`text-xs font-bold uppercase tracking-wider md:mt-2 mb-0 px-2 font-logo ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
        </motion.div>
      )}

      {/* Menu Items */}
      <motion.div
        key={
          open
            ? `menu-${animationKey}-${sectionName}`
            : `menu-collapsed-${sectionName}`
        }
        variants={containerVariants}
        initial="hidden"
        animate={open ? "visible" : "collapsed"}
        className="md:space-y-1"
      >
        {items.map((item) => (
          <motion.div
            key={item.path}
            variants={menuItemVariants}
            className="my-1"
          >
            <Link
              to={item.path}
              className={`group relative flex items-center rounded-lg xl:p-2 md:p-1.5 p-[3px] xl:text-sm md:text-[13px] text-[12px] font-bold font-logo transition-all duration-300 overflow-hidden ${
                isActive(item.path)
                  ? theme === "dark"
                    ? "text-[#0A9087] bg-[#054844] hover:bg-[#024e49] hover:text-white"
                    : "text-darkBlue bg-lightestBlue hover:bg-lightestGrey hover:text-mediumBlack"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-[#024e49] hover:text-white"
                    : "text-darkGrey hover:bg-lightestGrey hover:text-mediumBlack"
              }`}
            >
              {/* Icon container - always visible */}
              <motion.div
                variants={iconVariants}
                className={`flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200 ${
                  isActive(item.path)
                    ? theme === "dark"
                      ? "text-[#0A9087] group-hover:text-white"
                      : "text-darkBlue group-hover:text-mediumBlack"
                    : theme === "dark"
                      ? "text-[#0A9087] group-hover:text-white"
                      : "text-darkGrey group-hover:text-mediumBlack"
                }`}
              >
                {item.icon}
              </motion.div>
              {open && (
                <motion.span
                  variants={textVariants}
                  initial="closed"
                  animate="open"
                  className="ml-3 whitespace-nowrap font-medium"
                >
                  {item.text}
                </motion.span>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SidebarMenu;
