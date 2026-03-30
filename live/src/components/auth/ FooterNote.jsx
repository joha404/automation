export default function FooterNote({ isDark }) {
  return (
    <div
      className={`text-center py-2.5 px-4 rounded-xl text-xs ${
        isDark
          ? "bg-[#161820] border border-[#1e2130] text-slate-500"
          : "bg-slate-50 border border-slate-200 text-slate-500"
      }`}
    >
      Automatic billing starts after the free trial ends. Cancel anytime.
    </div>
  );
}
