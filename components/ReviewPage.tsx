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

export default function ReviewPage({ nominator, payload, onBack, onSubmitted }: Props) {
  const [nameMap, setNameMap]       = useState<Record<number, string>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Load all staff lists once so we can resolve IDs → names
  useEffect(() => {
    const load = async () => {
      try {
        const [male, female, all] = await Promise.all([
          api.getMaleStaff(),
          api.getFemaleStaff(),
          api.getAllStaff(),
        ]);
        const map: Record<number, string> = {};
        [...male, ...female, ...all].forEach(s => { map[s.id] = s.full_name; });
        setNameMap(map);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

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
                  {nameMap[payload[key]] ?? '—'}
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
