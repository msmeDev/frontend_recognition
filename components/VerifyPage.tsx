'use client';

import { useEffect, useRef, useState } from 'react';
import * as api from '../lib/api';
import type { StaffMember, StaffSearchResult } from '../types';

interface Props {
  onVerified: (staff: StaffMember) => void;
}

const DEBOUNCE_MS = 300;
const LISTBOX_ID = 'staff-name-suggestions';

export default function VerifyPage({ onVerified }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Autocomplete state ────────────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<StaffSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Set when a name is picked from the list, so picking doesn't trigger another search.
  const pickedRef = useRef<string | null>(null);

  // Debounced search: runs 300ms after the user stops typing.
  useEffect(() => {
    const query = name.trim();

    if (!query || pickedRef.current === name) {
      setSuggestions([]);
      setSearching(false);
      if (!query) setOpen(false);
      return;
    }

    const controller = new AbortController();
    setSearching(true);
    setSearchError(false);
    setOpen(true);

    const timer = setTimeout(async () => {
      try {
        const results = await api.searchStaff(query, controller.signal);
        setSuggestions(results);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setSuggestions([]);
        setSearchError(true);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, DEBOUNCE_MS);

    // A newer keystroke cancels the pending timer and any in-flight request.
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [name]);

  const pickSuggestion = (s: StaffSearchResult) => {
    pickedRef.current = s.fullName;
    setName(s.fullName);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Escape') setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      // Enter on a highlighted option picks it instead of submitting the form.
      e.preventDefault();
      pickSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setOpen(false);
    setLoading(true);
    setError('');

    try {
      // Step 1: verify name exists in staff list (uses whatever is in the input)
      const verifyRes = await api.verifyStaff(name.trim());

      if (!verifyRes.found || !verifyRes.staff) {
        setError('Name not found in staff list. Please check and try again.');
        setLoading(false);
        return;
      }

      // Step 2: check if this person has already submitted nominations
      const checkRes = await api.checkNominator(verifyRes.staff.id);

      if (checkRes.hasNominated) {
        setError(
          `${verifyRes.staff.full_name} has already submitted nominations. Each staff member may only nominate once.`,
        );
        setLoading(false);
        return;
      }

      // All good — proceed to the nomination form
      onVerified(verifyRes.staff);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const showDropdown = open && name.trim().length > 0 && !loading;
  const activeId = activeIndex >= 0 ? `${LISTBOX_ID}-${activeIndex}` : undefined;

  return (
    <div className="w-full max-w-md mt-16">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400/50 mb-4">
          <span className="text-2xl" role="img" aria-label="person">👤</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Staff Verification</h1>
        <p className="text-slate-400 text-sm mt-1">
          MSME Staff Recognition 2026
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Start typing your name and pick it from the list, or enter your full
          name as it appears in the staff directory.
        </p>

        <form onSubmit={handleVerify} noValidate>
          <label
            htmlFor="staff-name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Full Name
          </label>

          <div className="relative">
            <input
              id="staff-name"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-controls={LISTBOX_ID}
              aria-activedescendant={activeId}
              value={name}
              onChange={e => {
                pickedRef.current = null;
                setName(e.target.value);
                setError('');
              }}
              onFocus={() => {
                if (suggestions.length > 0) setOpen(true);
              }}
              onBlur={() => setOpen(false)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. James Okonkwo"
              autoComplete="off"
              autoFocus
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:bg-slate-50 disabled:cursor-not-allowed transition-shadow"
            />

            {showDropdown && (
              <div
                className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                // Keep focus on the input while clicking inside the dropdown.
                onMouseDown={e => e.preventDefault()}
              >
                {searching ? (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
                    <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                    Searching…
                  </div>
                ) : searchError ? (
                  <div className="px-4 py-3 text-sm text-red-600">
                    Couldn&apos;t load suggestions. You can still type your full name.
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No matching names found.
                  </div>
                ) : (
                  <ul id={LISTBOX_ID} role="listbox" className="max-h-64 overflow-y-auto py-1">
                    {suggestions.map((s, i) => (
                      <li
                        key={s.id}
                        id={`${LISTBOX_ID}-${i}`}
                        role="option"
                        aria-selected={i === activeIndex}
                        onClick={() => pickSuggestion(s)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`px-4 py-2.5 text-sm cursor-pointer text-slate-800 ${
                          i === activeIndex ? 'bg-blue-50 text-blue-800' : 'hover:bg-slate-50'
                        }`}
                      >
                        {s.fullName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <span className="text-red-500 text-sm mt-0.5" aria-hidden>⚠</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="mt-6 w-full py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900
                       disabled:bg-slate-300 disabled:cursor-not-allowed
                       text-white font-semibold rounded-xl transition-colors duration-150 text-base
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
