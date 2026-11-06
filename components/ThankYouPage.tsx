'use client';

export default function ThankYouPage() {
  return (
    <div className="w-full max-w-lg mt-16 text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-28 h-28 rounded-full bg-green-400/20 border-2 border-green-400/50 flex items-center justify-center">
          <span className="text-6xl" role="img" aria-label="celebration">🎉</span>
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-3xl font-bold text-white mb-2">Nominations Submitted!</h1>
      <p className="text-amber-400 font-semibold text-lg mb-6">MSME Staff Recognition 2026</p>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-5">
          <span className="text-4xl" role="img" aria-label="trophy">🏆</span>
        </div>

        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-4">
          Thank you for nominating your contestants.
        </p>

        <p className="text-slate-600 leading-relaxed mb-6">
          We wish and hope your preferred contestant wins.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
          <p className="font-medium mb-1">Your nominations have been recorded.</p>
          <p>Results will be announced at the MSME Staff Recognition 2026 ceremony.</p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            You can close this window. Each staff member may only submit once.
          </p>
        </div>
      </div>
    </div>
  );
}
