'use client';

interface Props {
  onStart: () => void;
}

export default function WelcomePage({ onStart }: Props) {
  return (
    <div className="w-full max-w-lg mt-16 text-center">
      {/* Trophy icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center">
          <span className="text-5xl" role="img" aria-label="trophy">🏆</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
        MSME Staff Recognition
      </h1>
      <p className="text-2xl font-semibold text-amber-400 mb-6">2026</p>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-left">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 text-center">
          Nomination Portal
        </h2>

        <p className="text-slate-600 leading-relaxed mb-4">
          Welcome to the MSME Staff Recognition 2026 Nomination Exercise. This is
          your opportunity to celebrate and honour outstanding colleagues who have
          made a meaningful impact this year.
        </p>

        <p className="text-slate-600 leading-relaxed mb-6">
          You will be asked to nominate one colleague per category across
          <strong className="text-slate-800"> 7 award categories</strong>. Each
          nominee may only appear in one category per submission.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 font-medium">Before you begin</p>
          <ul className="mt-2 text-sm text-blue-600 space-y-1 list-disc list-inside">
            <li>Your full name must match our staff records to proceed.</li>
            <li>Each staff member can submit only one set of nominations.</li>
            <li>You may nominate yourself in any category.</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold rounded-xl transition-colors duration-150 text-lg shadow-md"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
