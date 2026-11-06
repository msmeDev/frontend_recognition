'use client';

import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import type { StaffMember, CategoryDefinition, NominationPayload } from '../types';

interface Props {
  nominator: StaffMember;
  initialSelections?: NominationPayload;
  onReview: (payload: NominationPayload) => void;
}

const CATEGORIES: CategoryDefinition[] = [
  { key: 'best_staff_male_id',       label: 'Best Staff Male',       gender: 'male'   },
  { key: 'best_staff_female_id',     label: 'Best Staff Female',     gender: 'female' },
  { key: 'best_dressed_male_id',     label: 'Best Dressed Male',     gender: 'male'   },
  { key: 'best_dressed_female_id',   label: 'Best Dressed Female',   gender: 'female' },
  { key: 'most_social_staff_id',     label: 'Most Social Staff',     gender: 'all'    },
  { key: 'best_team_player_id',      label: 'Best Team Player',      gender: 'all'    },
  { key: 'most_supportive_staff_id', label: 'Most Supportive Staff', gender: 'all'    },
];

type Selections = Record<CategoryDefinition['key'], number>;

const EMPTY_SELECTIONS: Selections = {
  best_staff_male_id:       0,
  best_staff_female_id:     0,
  best_dressed_male_id:     0,
  best_dressed_female_id:   0,
  most_social_staff_id:     0,
  best_team_player_id:      0,
  most_supportive_staff_id: 0,
};

export default function NominationForm({ nominator, initialSelections, onReview }: Props) {
  const [maleStaff,   setMaleStaff]   = useState<StaffMember[]>([]);
  const [femaleStaff, setFemaleStaff] = useState<StaffMember[]>([]);
  const [allStaff,    setAllStaff]    = useState<StaffMember[]>([]);
  const [selections,  setSelections]  = useState<Selections>(
    initialSelections
      ? {
          best_staff_male_id:       initialSelections.best_staff_male_id,
          best_staff_female_id:     initialSelections.best_staff_female_id,
          best_dressed_male_id:     initialSelections.best_dressed_male_id,
          best_dressed_female_id:   initialSelections.best_dressed_female_id,
          most_social_staff_id:     initialSelections.most_social_staff_id,
          best_team_player_id:      initialSelections.best_team_player_id,
          most_supportive_staff_id: initialSelections.most_supportive_staff_id,
        }
      : EMPTY_SELECTIONS,
  );
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError,  setFetchError]  = useState('');

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
      } catch {
        setFetchError('Failed to load staff data. Please refresh the page.');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  // Return the right staff list for a given category key
  const getStaffList = (key: CategoryDefinition['key']): StaffMember[] => {
    const cat = CATEGORIES.find(c => c.key === key);
    if (cat?.gender === 'male')   return maleStaff;
    if (cat?.gender === 'female') return femaleStaff;
    return allStaff;
  };

  // Collect the full_names already selected in every OTHER dropdown
  const getDisabledNames = (excludeKey: CategoryDefinition['key']): Set<string> => {
    const disabled = new Set<string>();
    for (const cat of CATEGORIES) {
      if (cat.key === excludeKey) continue;
      const id = selections[cat.key];
      if (!id) continue;
      const found = getStaffList(cat.key).find(s => s.id === id);
      if (found) disabled.add(found.full_name);
    }
    return disabled;
  };

  const handleSelect = (key: CategoryDefinition['key'], value: string) => {
    setSelections(prev => ({ ...prev, [key]: Number(value) }));
    setSubmitError('');
  };

  const allSelected = CATEGORIES.every(c => selections[c.key] !== 0);
  const filled      = CATEGORIES.filter(c => selections[c.key] !== 0).length;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allSelected) return;
    onReview({
      nominator_id:            nominator.id,
      best_staff_male_id:       selections.best_staff_male_id,
      best_staff_female_id:     selections.best_staff_female_id,
      best_dressed_male_id:     selections.best_dressed_male_id,
      best_dressed_female_id:   selections.best_dressed_female_id,
      most_social_staff_id:     selections.most_social_staff_id,
      best_team_player_id:      selections.best_team_player_id,
      most_supportive_staff_id: selections.most_supportive_staff_id,
    });
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center mt-32 text-white gap-4">
        <span className="inline-block w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-slate-300">Loading staff list…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mt-16 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl text-center">
        <p className="text-red-600 font-medium">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mb-16">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400/50 mb-4">
          <span className="text-2xl" role="img" aria-label="ballot">🗳️</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Nomination Form</h1>
        <p className="text-slate-400 text-sm mt-1">MSME Staff Recognition 2026</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Nominator banner */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <span className="text-2xl" role="img" aria-label="user">👤</span>
          <div>
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Nominating as</p>
            <p className="text-blue-900 font-semibold">{nominator.full_name}</p>
          </div>
          {/* Progress pill */}
          <div className="ml-auto text-right">
            <span className="text-xs text-slate-500">Progress</span>
            <p className="text-sm font-bold text-blue-700">{filled} / 7</p>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Select one nominee per category. The same person <strong>cannot</strong> appear
          in more than one category. Self-nomination is allowed.
        </p>

        <form onSubmit={handleReview}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {CATEGORIES.map(cat => {
              const staffList    = getStaffList(cat.key);
              const disabledNames = getDisabledNames(cat.key);
              const selectedId   = selections[cat.key];

              return (
                <div key={cat.key} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={cat.key}
                    className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        selectedId ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                    />
                    {cat.label}
                  </label>

                  <div className="relative">
                    <select
                      id={cat.key}
                      value={selectedId || ''}
                      onChange={e => handleSelect(cat.key, e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl
                                 text-slate-700 bg-white appearance-none cursor-pointer
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-shadow text-sm"
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
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-6 mb-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Categories filled</span>
              <span>{filled} of 7</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(filled / 7) * 100}%` }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!allSelected}
            className="mt-6 w-full py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900
                       disabled:bg-slate-300 disabled:cursor-not-allowed
                       text-white font-semibold rounded-xl transition-colors duration-150
                       flex items-center justify-center gap-2 text-base"
          >
            {allSelected ? 'Review Nominations →' : `Please complete all ${7 - filled} remaining ${7 - filled === 1 ? 'category' : 'categories'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
