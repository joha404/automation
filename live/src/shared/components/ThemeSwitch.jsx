import { motion } from "framer-motion";
import { BsMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { SiSunrise } from "react-icons/si";

const ThemeSwitch = ({ theme, toggleTheme, openBar }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`p-1.5 ${
        openBar ? "rounded-md" : "rounded-full"
      } transition-colors duration-300 cursor-pointer ${
        theme === "dark"
          ? "bg-[#086C65] text-[#B7E5E1] hover:bg-[#0A9087]"
          : "bg-lightBlack text-white hover:bg-darkBlack"
      }`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {theme === "dark" ? (
          <MdSunny size={15} className=" rounded-full" />
        ) : (
          <BsMoonStarsFill size={15} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitch;
