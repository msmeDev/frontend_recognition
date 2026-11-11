'use client';

import { SquiggleUnderline } from './Doodles';

// Big handwritten page title with a mustard squiggle under it.
export function PageHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3 text-center">
      <div className="mb-1 inline-block -rotate-3">{icon}</div>
      <h1 className="relative mx-auto w-fit text-4xl font-bold leading-none text-stone-800">
        {title}
        <SquiggleUnderline className="absolute -bottom-2 left-0 h-3 w-full text-yellow-400" />
      </h1>
      {subtitle && <p className="mt-1 text-sm font-semibold tracking-wide text-stone-500">{subtitle}</p>}
    </div>
  );
}

// "Submitting as Jane Doe · Not you? Start over"
export function NominatorBanner({
  label,
  name,
  onStartOver,
  disabled = false,
  aside,
}: {
  label: string;
  name: string;
  onStartOver: () => void;
  disabled?: boolean;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-2 border-dashed border-green-700/60 bg-green-50/60 px-4 py-2 rounded-[1rem_0.5rem_1.2rem_0.6rem]">
      <p className="min-w-0 flex-1 leading-snug">
        <span className="text-sm font-semibold text-green-800">{label} </span>
        <span className="font-hand text-2xl font-bold text-stone-800">{name}</span>
        <span className="mx-2 hidden text-stone-400 sm:inline" aria-hidden="true">·</span>
        {/* Own line on phones so a long name can't push it outside the box */}
        <span className="mt-1 block whitespace-nowrap sm:mt-0 sm:inline">
          <span className="text-sm text-stone-500">Not you? </span>
          <button type="button" onClick={onStartOver} disabled={disabled} className="doodle-link">
            Start over
          </button>
        </span>
      </p>
      {aside}
    </div>
  );
}

// Standard error / warning notes.
export function Note({ tone, children }: { tone: 'error' | 'warning'; children: React.ReactNode }) {
  const styles =
    tone === 'error'
      ? 'border-red-700 bg-red-50 text-red-800'
      : 'border-yellow-600 bg-yellow-100 text-stone-800';
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2 border-2 border-dashed px-3 py-2.5 rounded-[0.8rem_0.4rem_0.9rem_0.5rem] ${styles}`}
    >
      <span className="font-hand text-xl font-bold leading-5" aria-hidden="true">!</span>
      <p className="text-sm">{children}</p>
    </div>
  );
}
