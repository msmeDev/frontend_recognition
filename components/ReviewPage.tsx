'use client';

import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import type { StaffMember, NominationPayload } from '../types';

interface Props {
  nominator: StaffMember;
  payload: NominationPayload;
  onBack: () => void;
  onSubmitted: () => void;
}

const CATEGORY_LABELS: Array<{ key: keyof Omit<NominationPayload, 'nominator_id'>; label: string; gender: 'male' | 'female' | 'all' }> = [
  { key: 'best_staff_male_id',       label: 'Best Staff Male',       gender: 'male'   },
  { key: 'best_staff_female_id',     label: 'Best Staff Female',     gender: 'female' },
  { key: 'best_dressed_male_id',     label: 'Best Dressed Male',     gender: 'male'   },
  { key: 'best_dressed_female_id',   label: 'Best Dressed Female',   gender: 'female' },
  { key: 'most_social_staff_id',     label: 'Most Social Staff',     gender: 'all'    },
  { key: 'best_team_player_id',      label: 'Best Team Player',      gender: 'all'    },
  { key: 'most_supportive_staff_id', label: 'Most Supportive Staff', gender: 'all'    },
];

// Resolve each category's selected ID to a name using the correct gender-specific list.
// All three tables have their own auto-increment IDs starting at 1, so a flat id→name
// map built from all lists would collide (femaleStaff[id=1] overwrites maleStaff[id=1]).
function buildCategoryNameMap(
  payload: NominationPayload,
  male: StaffMember[],
  female: StaffMember[],
  all: StaffMember[],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const { key, gender } of CATEGORY_LABELS) {
    const id = payload[key];
    const list = gender === 'male' ? male : gender === 'female' ? female : all;
    result[key] = list.find(s => s.id === id)?.full_name ?? '—';
  }
  return result;
}

export default function ReviewPage({ nominator, payload, onBack, onSubmitted }: Props) {
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [male, female, all] = await Promise.all([
          api.getMaleStaff(),
          api.getFemaleStaff(),
          api.getAllStaff(),
        ]);
        setCategoryNames(buildCategoryNameMap(payload, male, female, all));
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [payload]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.submitNomination(payload);
      onSubmitted();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mb-16">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-400/20 border-2 border-green-400/50 mb-4">
          <span className="text-2xl" role="img" aria-label="clipboard">📋</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Review Your Nominations</h1>
        <p className="text-slate-400 text-sm mt-1">Please confirm before submitting</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Nominator banner */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <span className="text-2xl" role="img" aria-label="user">👤</span>
          <div>
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Submitting as</p>
            <p className="text-blue-900 font-semibold">{nominator.full_name}</p>
          </div>
        </div>

        {/* Nominations list */}
        {loadingData ? (
          <div className="flex justify-center py-8">
            <span className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {CATEGORY_LABELS.map(({ key, label }) => (
              <li key={key} className="flex items-center justify-between py-3.5 gap-4">
                <span className="text-sm font-medium text-slate-600 shrink-0">{label}</span>
                <span className="text-sm font-semibold text-slate-900 text-right">
                  {categoryNames[key] ?? '—'}
                </span>
              </li>
            ))}
          </ul>
        )}

        {submitError && (
          <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <span className="text-red-500 text-sm mt-0.5" aria-hidden>⚠</span>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="flex-1 py-3 border-2 border-slate-300 hover:border-slate-400
                       text-slate-700 font-semibold rounded-xl transition-colors duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Go Back and Edit
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || loadingData}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800
                       disabled:bg-slate-300 disabled:cursor-not-allowed
                       text-white font-semibold rounded-xl transition-colors duration-150
                       flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              'Confirm & Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
