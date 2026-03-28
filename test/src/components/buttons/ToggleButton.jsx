import { motion } from "framer-motion";

const ToggleButton = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`cursor-pointer relative inline-flex md:h-5 md:w-11 items-center h-4 w-8 rounded-full focus:outline-none ${
        enabled ? "bg-[#013633]" : "bg-mediumGrey"
      }`}
      aria-pressed={enabled}
    >
      <motion.span
        className="absolute h-4 w-4 bg-white rounded-full shadow-md md:block hidden"
        initial={false}
        animate={{
          x: enabled ? 26 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      />
      <motion.span
        className="absolute h-3 w-3 bg-white rounded-full shadow-md md:hidden"
        initial={false}
        animate={{
          x: enabled ? 19 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      />
    </button>
  );
};

export default ToggleButton;
