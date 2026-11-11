'use client';

import { Arrow, Sparkle, SquiggleUnderline, Star, Tape, TrophyDoodle } from './Doodles';

interface Props {
  onStart: () => void;
}

export default function WelcomePage({ onStart }: Props) {
  return (
    <div className="w-full max-w-xl mt-4 sm:mt-6 mb-6">
      {/* Flyer heading */}
      <div className="relative mb-5 text-center">
        <TrophyDoodle className="wiggle mx-auto mb-1 h-12 w-12 text-orange-700 sm:h-14 sm:w-14" />
        <Sparkle className="absolute left-6 top-4 h-6 w-6 text-yellow-500 sm:left-14" />
        <Star className="absolute right-8 top-10 h-5 w-5 rotate-12 text-green-700 sm:right-16" />

        <h1 className="text-5xl font-bold leading-[0.85] text-stone-800 sm:text-6xl">
          MSME Staff
          <br />
          <span className="relative inline-block text-orange-700">
            Recognition
            <SquiggleUnderline className="absolute -bottom-2 left-0 h-3 w-full text-yellow-400" />
          </span>
        </h1>

        {/* Year sticker */}
        <span
          className="mt-4 inline-block rotate-[-4deg] border-2 border-stone-800 bg-yellow-400 px-4 py-1
                     font-hand text-3xl font-bold text-stone-900 shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                     rounded-[0.8rem_0.4rem_0.9rem_0.5rem]"
        >
          2026
        </span>
      </div>

      {/* Card */}
      <div className="hand-card p-5 sm:p-7 text-left">
        <Tape className="-top-4 left-1/2 -translate-x-1/2 -rotate-2" />

        <h2 className="mb-3 text-center text-4xl font-bold text-stone-800">Nomination Portal</h2>

        <p className="mb-4 leading-relaxed text-stone-700">
          Welcome to the MSME Staff Recognition 2026 Nomination Exercise — your opportunity
          to celebrate and honour outstanding colleagues. You will nominate one person per
          category across{' '}
          <strong className="font-hand text-2xl font-bold leading-none text-orange-700">7 award categories</strong>.
          Each nominee may only appear in one category per submission.
        </p>

        <div className="mb-5 border-2 border-dashed border-green-700/60 bg-green-50/60 p-4 rounded-[1rem_0.5rem_1.2rem_0.6rem]">
          <p className="font-hand text-2xl font-bold text-green-800">Before you begin…</p>
          <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
            {[
              'Your full name must match our staff records to proceed.',
              'Each staff member can submit only one set of nominations.',
              'You may nominate yourself in any category.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <Arrow className="mt-0.5 h-4 w-6 shrink-0 text-green-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button onClick={onStart} className="sticker sticker-mustard w-full px-10 text-3xl sm:w-auto">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
