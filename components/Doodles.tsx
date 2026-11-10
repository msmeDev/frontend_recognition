// Hand-drawn SVG doodles. All decorative: aria-hidden, stroke = currentColor,
// so colour comes from a text-* class.

import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Svg({ children, viewBox, strokeWidth = 2.5, ...rest }: P & { viewBox: string }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false" {...stroke} strokeWidth={strokeWidth} {...rest}>
      {children}
    </svg>
  );
}

// ── Background corner doodles ──────────────────────────────────────────────

// Uneven ray lengths so it doesn't look machine-made. Fixed values keep SSR and client identical.
const RAYS = [26, 34, 24, 38, 28, 33, 25, 36, 27, 35, 24, 31];

export function Sunburst(props: P) {
  return (
    <Svg viewBox="0 0 120 120" strokeWidth={3} {...props}>
      <path d="M60 44c9-1 16 7 15 16s-8 15-16 14-14-8-13-16 6-13 14-14z" />
      {RAYS.map((len, i) => {
        const a = (i / RAYS.length) * Math.PI * 2;
        const r1 = 22;
        const x1 = 60 + Math.cos(a) * r1;
        const y1 = 60 + Math.sin(a) * r1;
        const x2 = 60 + Math.cos(a + 0.06) * (r1 + len);
        const y2 = 60 + Math.sin(a + 0.06) * (r1 + len);
        return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
      })}
    </Svg>
  );
}

export function Squiggle(props: P) {
  return (
    <Svg viewBox="0 0 200 60" strokeWidth={3} {...props}>
      <path d="M6 32c18-26 34 26 52 0s34-26 52 0 34 26 52 0 22-18 32-6" />
    </Svg>
  );
}

export function Loop(props: P) {
  return (
    <Svg viewBox="0 0 160 90" strokeWidth={3} {...props}>
      <path d="M8 70c22-44 56-58 62-34 5 20-24 34-28 16-4-16 26-36 52-30 22 5 30 26 58 12" />
    </Svg>
  );
}

export function Star(props: P) {
  return (
    <Svg viewBox="0 0 24 24" strokeWidth={1.8} {...props}>
      <path d="M12 2.5l2.7 6.6 7 .4-5.4 4.5 1.8 6.9L12 17l-6.1 3.9 1.8-6.9-5.4-4.5 7-.4z" />
    </Svg>
  );
}

export function Sparkle(props: P) {
  return (
    <Svg viewBox="0 0 24 24" strokeWidth={1.8} {...props}>
      <path d="M12 2c.4 6 4 9.6 10 10-6 .4-9.6 4-10 10-.4-6-4-9.6-10-10 6-.4 9.6-4 10-10z" />
    </Svg>
  );
}

export function BackgroundDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Sunburst className="absolute -left-10 -top-10 w-36 text-yellow-500 opacity-50 sm:w-48" />
      <Squiggle className="absolute right-4 top-6 hidden w-40 rotate-6 text-orange-700 opacity-30 sm:block" />
      <Sparkle className="absolute right-10 top-24 w-6 text-green-700 opacity-40 sm:right-56 sm:top-10" />
      <Star className="absolute bottom-24 left-6 hidden w-8 -rotate-12 text-green-700 opacity-35 sm:block" />
      <Star className="absolute bottom-10 left-20 hidden w-5 rotate-12 text-orange-700 opacity-35 sm:block" />
      <Sparkle className="absolute bottom-36 left-24 hidden w-4 text-yellow-600 opacity-50 md:block" />
      <Loop className="absolute -bottom-2 -right-6 w-40 text-orange-700 opacity-25 sm:w-56" />
    </div>
  );
}

// ── Inline accents ─────────────────────────────────────────────────────────

export function SquiggleUnderline(props: P) {
  return (
    <Svg viewBox="0 0 200 14" strokeWidth={4} preserveAspectRatio="none" {...props}>
      <path d="M3 9c22-6 40 3 62-1s38-6 60-2 50 3 72-3" />
    </Svg>
  );
}

export function Check(props: P) {
  return (
    <Svg viewBox="0 0 24 24" strokeWidth={3.2} {...props}>
      <path d="M4 13.5c2 1.4 3.6 3.2 5 5.2 3-6 6.6-10.4 11-14" />
    </Svg>
  );
}

export function Arrow(props: P) {
  return (
    <Svg viewBox="0 0 40 24" strokeWidth={2.5} {...props}>
      <path d="M3 13c10-3 20-3 32-1M27 5c3 2 6 5 8 7-3 2-6 4-8 7" />
    </Svg>
  );
}

// ── Page icons (replace the old emoji badges) ──────────────────────────────

export function TrophyDoodle(props: P) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <path d="M20 10.5c8-.8 16-.6 24 .2-.2 12-2 22-12 24.6-9.6-2.4-11.8-12.6-12-24.8z" />
      <path d="M20.5 15c-5-.4-8 1-7.6 5 .5 5 4.6 7.6 9.2 7.8M43.6 15c5-.5 8 .8 7.6 4.8-.4 5-4.6 7.8-9.2 8" />
      <path d="M32 35.5v9M24.5 52.5c5-.8 10-.9 15.2 0l-1.6-7.6c-4-.6-8-.6-12 0z" />
      <path d="M28 17.5l2.4 4.4 4.8.6-3.6 3.2 1 4.6-4.2-2.4" strokeWidth={2} />
    </Svg>
  );
}

export function PencilDoodle(props: P) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <path d="M14 50.5l3.6-11.8L43.4 13c2.6-2.4 5.6-2 7.6.2s2.4 5-.2 7.6L25 46.4z" />
      <path d="M17.6 38.7c3 .4 6.2 3.6 7.4 7.7M39.4 17c3.4.6 6.6 3.6 7.6 7.4" />
      <path d="M10 56c8-1.6 16 1.4 24-.6" strokeWidth={2} />
    </Svg>
  );
}

export function BallotDoodle(props: P) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <path d="M12 26.5c13-.6 27-.6 40 .4l-1.6 26c-12.4.8-24.6.8-37 0z" />
      <path d="M8.5 26.8c15.6-1.4 31.4-1.2 47 .2" />
      <path d="M24 26c-.4-6 .2-12 .8-18 5 .4 10.4.2 15.6-.2.6 6 .6 12 .2 18" />
      <path d="M28 16.5l3 3 5.4-6.4" strokeWidth={2.2} />
    </Svg>
  );
}

export function ClipboardDoodle(props: P) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <path d="M15 12.5c11.4-.8 22.8-.8 34.2.2.6 14 .4 28-.6 42-11 .8-22 .6-33 0-.8-14-1-28-.6-42.2z" />
      <path d="M25 9c4.6-.6 9.2-.6 14 .2l.4 6.4c-4.8.6-9.6.6-14.6 0z" />
      <path d="M21.5 26.5l2.6 2.6 4.4-5M33 27c4.4-.4 8.6-.4 12 .2M21.5 38.5l2.6 2.6 4.4-5M33 39c4.4-.4 8.6-.4 12 .2" strokeWidth={2.2} />
    </Svg>
  );
}

export function HeartDoodle(props: P) {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <path d="M32 53c-12-8.4-22.6-17-22.4-28.4.2-7 5.6-12 12-11.6 4.6.2 8.4 3.2 10.4 7.4 2.4-4.6 6.4-7.6 11.2-7.4 6.6.4 11.4 6 10.8 12.6-1 11-11.4 19-22 27.4z" />
      <path d="M19.5 23.5c.6-2.6 2.6-4.4 5.2-4.6" strokeWidth={2} />
    </Svg>
  );
}

// Strip of washi tape. Position it with absolute utility classes.
export function Tape({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`washi ${className}`} />;
}

// Round doodle badge used at the top of each step.
export function IconBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-flex h-16 w-16 items-center justify-center border-2 border-stone-800 bg-card
                  rounded-[48%_52%_45%_55%/55%_45%_55%_45%] shadow-[3px_3px_0px_0px_rgba(41,37,36,1)] ${className}`}
    >
      {children}
    </div>
  );
}
