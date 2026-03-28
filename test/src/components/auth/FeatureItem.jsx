import { GiCheckMark } from "react-icons/gi";
import { CgClose } from "react-icons/cg";

export default function FeatureItem({ feature, isDark }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
          feature.included
            ? isDark
              ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/20"
              : "text-emerald-600 bg-emerald-50 border border-emerald-200"
            : isDark
              ? "text-slate-600 bg-[#1a1d25]"
              : "text-slate-300 bg-slate-50 border border-slate-100"
        }`}
      >
        {feature.included ? (
          <GiCheckMark className="w-2.5 h-2.5" />
        ) : (
          <CgClose className="w-2.5 h-2.5" />
        )}
      </div>
      <p
        className={`text-sm ${
          feature.included
            ? isDark
              ? "text-slate-300"
              : "text-slate-700"
            : isDark
              ? "text-slate-600 line-through"
              : "text-slate-300 line-through"
        }`}
      >
        {feature.text}
      </p>
    </div>
  );
}
