'use client';

import type { CSSProperties } from 'react';
import { HeartDoodle, Sparkle, SquiggleUnderline, Star, Tape, TrophyDoodle } from './Doodles';

// Confetti layout is computed from the index (not Math.random) so server and
// client markup match. Hidden entirely for prefers-reduced-motion (globals.css).
const COLORS = ['bg-orange-700', 'bg-yellow-400', 'bg-green-700', 'bg-stone-800', 'bg-orange-300', 'bg-green-400'];
const SHAPES = [
  'h-3.5 w-2 rounded-[2px]',
  'h-2.5 w-2.5 rounded-full',
  'h-4 w-1 rounded-full',
  'h-2 w-3 rounded-[1px]',
];

const CONFETTI = Array.from({ length: 32 }, (_, i) => ({
  left: `${(i * 37 + 7) % 100}%`,
  className: `${COLORS[i % COLORS.length]} ${SHAPES[(i * 3) % SHAPES.length]}`,
  style: {
    animationDelay: `${((i * 13) % 20) * 0.12}s`,
    animationDuration: `${3.4 + ((i * 7) % 5) * 0.5}s`,
    '--drift': `${((i * 5) % 9 - 4) * 14}px`,
    '--spin': `${(i % 2 ? 1 : -1) * (360 + ((i * 11) % 4) * 120)}deg`,
  } as CSSProperties,
}));

export default function ThankYouPage() {
  return (
    <div className="w-full max-w-lg mt-6 sm:mt-8 mb-6 text-center">
      {/* Confetti */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <span key={i} className={`confetti-piece ${c.className}`} style={{ left: c.left, ...c.style }} />
        ))}
      </div>

      {/* Greeting card */}
      <div className="hand-card relative rotate-[-1deg] p-3 sm:p-4">
        <Tape className="-top-4 left-6 -rotate-6" />
        <Tape className="-top-4 right-6 rotate-6" />

        {/* Inner dashed frame, like a printed invitation */}
        <div className="border-2 border-dashed border-orange-700/50 px-5 py-8 sm:px-8 rounded-[1.6rem_0.8rem_1.6rem_0.8rem]">
          <div className="relative mb-2 flex justify-center">
            <Sparkle className="absolute left-4 top-0 h-6 w-6 text-yellow-500 sm:left-12" />
            <Star className="absolute right-6 top-6 h-5 w-5 rotate-12 text-green-700 sm:right-14" />
            <HeartDoodle className="wiggle h-16 w-16 text-orange-700" />
          </div>

          <h1 className="relative mx-auto w-fit text-6xl font-bold leading-none text-orange-700 sm:text-7xl">
            Thank you!
            <SquiggleUnderline className="absolute -bottom-2 left-0 h-3 w-full text-yellow-400" />
          </h1>

          <p className="mt-6 font-hand text-3xl font-bold text-stone-800">Nominations Submitted</p>
          <p className="font-hand text-2xl text-green-700">MSME Staff Recognition 2026</p>

          <div className="my-6 flex justify-center">
            <TrophyDoodle className="h-14 w-14 text-yellow-500" />
          </div>

          <p className="mb-3 text-lg font-semibold leading-relaxed text-stone-800">
            Thank you for nominating your contestants.
          </p>

          <p className="mb-6 leading-relaxed text-stone-600">
            We wish and hope your preferred contestant wins.
          </p>

          <div className="border-2 border-dashed border-green-700/60 bg-green-50/70 p-4 text-left text-sm text-stone-700 rounded-[1rem_0.5rem_1.2rem_0.6rem]">
            <p className="mb-1 font-hand text-2xl font-bold text-green-800">Your nominations have been recorded.</p>
            <p>
              The MSME Social Committee will now collate the results. The voting date will be announced
              soon so you can vote for your preferred contestants.
            </p>
          </div>

          <p className="mt-8 font-hand text-xl text-stone-500">
            You can close this window. Each staff member may only submit once.
          </p>
        </div>
      </div>
    </div>
  );
}
