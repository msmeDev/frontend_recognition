'use client';

import { useState, useEffect, useRef } from 'react';
import * as api from '../lib/api';
import { CATEGORIES } from '../lib/categories';
import type { StaffMember, CategoryKey, Nominations } from '../types';
import { Arrow, BallotDoodle, Check, IconBadge, Tape } from './Doodles';
import { NominatorBanner, PageHeader } from './WizardChrome';

interface Props {
  nominator: StaffMember;
  // Controlled: the wizard in app/page.tsx owns the selections and persists them.
  nominations: Nominations;
  onChange: (nominations: Nominations) => void;
  onReview: () => void;
  onStartOver: () => void;
}

export default function NominationForm({ nominator, nominations, onChange, onReview, onStartOver }: Props) {
  const [maleStaff,   setMaleStaff]   = useState<StaffMember[]>([]);
  const [femaleStaff, setFemaleStaff] = useState<StaffMember[]>([]);
  const [allStaff,    setAllStaff]    = useState<StaffMember[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError,  setFetchError]  = useState('');

  // Latest selections/callback, read when the lists arrive without re-running the fetch.
  const latest = useRef({ nominations, onChange });
  latest.current = { nominations, onChange };

  // Load all three staff lists on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [male, female, all] = await Promise.all([
          api.getMaleStaff(),
          api.getFemaleStaff(),
          api.getAllStaff(),
        ]);
        setMaleStaff(male);
        setFemaleStaff(female);
        setAllStaff(all);

        // A restored draft may point at staff that no longer exist (e.g. after a
        // re-seed). Keep only picks whose id AND name still match the current list.
        const lists = { male, female, all };
        const current = latest.current.nominations;
        const cleaned: Nominations = {};
        for (const cat of CATEGORIES) {
          const picked = current[cat.key];
          if (!picked) continue;
          const match = lists[cat.gender].find(
            s => s.id === picked.id && s.full_name === picked.full_name,
          );
          if (match) cleaned[cat.key] = { id: match.id, full_name: match.full_name };
        }
        if (Object.keys(cleaned).length !== Object.keys(current).length) {
          latest.current.onChange(cleaned);
        }
      } catch {
        setFetchError('Failed to load staff data. Please refresh the page.');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  // Return the right staff list for a given category key
  const getStaffList = (key: CategoryKey): StaffMember[] => {
    const cat = CATEGORIES.find(c => c.key === key);
    if (cat?.gender === 'male')   return maleStaff;
    if (cat?.gender === 'female') return femaleStaff;
    return allStaff;
  };

  // Collect the full_names already selected in every OTHER dropdown
  const getDisabledNames = (excludeKey: CategoryKey): Set<string> => {
    const disabled = new Set<string>();
    for (const cat of CATEGORIES) {
      if (cat.key === excludeKey) continue;
      const picked = nominations[cat.key];
      if (picked) disabled.add(picked.full_name);
    }
    return disabled;
  };

  // Store the whole { id, full_name } so the Review page can display it directly.
  const handleSelect = (key: CategoryKey, value: string) => {
    const next: Nominations = { ...nominations };
    const staff = getStaffList(key).find(s => s.id === Number(value));
    if (staff) next[key] = { id: staff.id, full_name: staff.full_name };
    else delete next[key];
    onChange(next);
  };

  const filled      = CATEGORIES.filter(c => nominations[c.key]).length;
  const allSelected = filled === CATEGORIES.length;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allSelected) return;
    onReview();
  };

  if (loadingData) {
    return (
      <div className="mt-32 flex flex-col items-center justify-center gap-4 text-stone-700">
        <span className="hand-spinner h-12 w-12 border-[3px] text-orange-700" />
        <p className="font-hand text-2xl">Loading staff list…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="hand-card mt-16 w-full max-w-md p-8 text-center">
        <p className="font-semibold text-red-800">{fetchError}</p>
        <button onClick={() => window.location.reload()} className="sticker sticker-mustard mt-6">
          Refresh
        </button>
      </div>
    );
  }

  const remaining = CATEGORIES.length - filled;

  return (
    <div className="w-full max-w-3xl mt-4 sm:mt-8 mb-16">
      <PageHeader
        icon={
          <IconBadge>
            <BallotDoodle className="h-10 w-10 text-orange-700" />
          </IconBadge>
        }
        title="Nomination Form"
        subtitle="MSME Staff Recognition 2026"
      />

      <div className="hand-card p-5 sm:p-8">
        <Tape className="-top-4 left-10 -rotate-3" />
        <Tape className="-top-4 right-10 hidden rotate-2 sm:block" />

        <NominatorBanner
          label="Nominating as"
          name={nominator.full_name}
          onStartOver={onStartOver}
          aside={
            <span
              className="ml-auto rotate-2 border-2 border-stone-800 bg-yellow-400 px-3 py-1 font-hand text-2xl font-bold leading-none text-stone-900 rounded-[0.6rem_0.3rem_0.7rem_0.4rem]"
              aria-label={`${filled} of ${CATEGORIES.length} categories filled`}
            >
              {filled} / {CATEGORIES.length}
            </span>
          }
        />

        <p className="mb-8 text-sm leading-relaxed text-stone-600">
          Select one nominee per category. The same person{' '}
          <strong className="font-hand text-xl text-orange-700">cannot</strong> appear in more than
          one category. Self-nomination is allowed.
        </p>

        <form onSubmit={handleReview}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-7 lg:grid-cols-2">
            {CATEGORIES.map((cat, index) => {
              const staffList    = getStaffList(cat.key);
              const disabledNames = getDisabledNames(cat.key);
              const selectedId   = nominations[cat.key]?.id ?? 0;

              return (
                <div key={cat.key} className="flex flex-col gap-1">
                  <label htmlFor={cat.key} className="flex items-center gap-2">
                    {/* Numbered circle that turns into a green tick once filled */}
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center border-2 font-hand text-lg font-bold leading-none
                                  rounded-[50%_45%_55%_48%] ${
                        selectedId
                          ? 'border-green-700 bg-green-50 text-green-700'
                          : 'border-stone-400 text-stone-500'
                      }`}
                      aria-hidden="true"
                    >
                      {selectedId ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span className="font-hand text-2xl font-bold leading-none text-stone-800">{cat.label}</span>
                  </label>

                  <div className="relative">
                    <select
                      id={cat.key}
                      value={selectedId || ''}
                      onChange={e => handleSelect(cat.key, e.target.value)}
                      className={`line-input cursor-pointer pr-8 ${selectedId ? 'font-semibold text-stone-900' : 'text-stone-500'}`}
                    >
                      <option value="">— Select nominee —</option>
                      {staffList.map(staff => {
                        const isBlocked =
                          disabledNames.has(staff.full_name) && selectedId !== staff.id;
                        return (
                          <option key={staff.id} value={staff.id} disabled={isBlocked}>
                            {staff.full_name}
                            {isBlocked ? ' (already nominated)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <Arrow
                      className="pointer-events-none absolute right-1 top-1/2 h-4 w-5 -translate-y-1/2 rotate-90 text-stone-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-10 mb-2">
            <div className="mb-2 flex justify-between font-hand text-xl text-stone-600">
              <span>Categories filled</span>
              <span>
                {filled} of {CATEGORIES.length}
              </span>
            </div>
            <div
              className="hand-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={CATEGORIES.length}
              aria-valuenow={filled}
              aria-label="Categories filled"
            >
              <span className="hand-progress-fill" style={{ width: `${(filled / CATEGORIES.length) * 100}%` }} />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={!allSelected}
              className="sticker sticker-terracotta w-full sm:w-auto sm:px-10"
            >
              {allSelected
                ? 'Review Nominations →'
                : `Please complete all ${remaining} remaining ${remaining === 1 ? 'category' : 'categories'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
