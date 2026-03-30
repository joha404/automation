export default function PopupHeader({ isDark }) {
  return (
    <div className="text-center mb-1">
      {isDark ? (
        <>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-blue-500/15 text-blue-400 border border-blue-500/20">
            7-DAY FREE TRIAL
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight">
            Claim Your Free Trial Today!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">Cancel anytime</p>
        </>
      ) : (
        <>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-blue-600 text-white shadow-sm shadow-blue-200">
            FREE TRIAL
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1 tracking-tight">
            Claim Your Free Trial Today!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Start your 7-day free trial · No credit card required
          </p>
        </>
      )}
    </div>
  );
}
