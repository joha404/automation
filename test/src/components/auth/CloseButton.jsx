import { CgClose } from "react-icons/cg";

export default function CloseButton({ onClick, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-4 right-4 p-2 rounded-full z-10 transition-all duration-200 cursor-pointer ${
        isDark
          ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
          : "bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-sm"
      }`}
    >
      <CgClose className="w-5 h-5" />
    </button>
  );
}
