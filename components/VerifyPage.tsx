'use client';

import { useEffect, useRef, useState } from 'react';
import * as api from '../lib/api';
import type { StaffMember, StaffSearchResult } from '../types';
import { IconBadge, PencilDoodle, Tape } from './Doodles';
import { Note, PageHeader } from './WizardChrome';

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
    <div className="w-full max-w-md mt-6 sm:mt-8 mb-6">
      <PageHeader
        icon={
          <IconBadge>
            <PencilDoodle className="h-10 w-10 text-orange-700" />
          </IconBadge>
        }
        title="Who's nominating?"
        subtitle="MSME Staff Recognition 2026"
      />

      {/* Notepad card */}
      <div className="hand-card notepad px-6 pb-8 pt-7 sm:pl-14 sm:pr-8">
        <Tape className="-top-4 right-8 rotate-3" />

        <p className="mb-6 leading-8 text-stone-700">
          Start typing your name and pick it from the list, or enter your full
          name as it appears in the staff directory.
        </p>

        <form onSubmit={handleVerify} noValidate>
          <label htmlFor="staff-name" className="block font-hand text-2xl font-bold text-orange-700">
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
              className="line-input font-hand text-3xl leading-tight placeholder:text-stone-400"
            />

            {showDropdown && (
              <div
                className="sticky-note absolute left-1 right-1 z-20 mt-3 rotate-[-0.6deg] overflow-hidden"
                // Keep focus on the input while clicking inside the dropdown.
                onMouseDown={e => e.preventDefault()}
              >
                {searching ? (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-stone-700">
                    <span className="hand-spinner h-4 w-4 text-orange-700" />
                    Searching…
                  </div>
                ) : searchError ? (
                  <div className="px-4 py-3 text-sm text-red-800">
                    Couldn&apos;t load suggestions. You can still type your full name.
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-stone-700">
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
                        className={`cursor-pointer border-b border-dashed border-yellow-600/40 px-4 py-2 font-hand text-2xl leading-tight text-stone-800 last:border-b-0 ${
                          i === activeIndex ? 'bg-yellow-300 text-orange-800' : ''
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
            <div className="mt-4">
              <Note tone="error">{error}</Note>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="sticker sticker-terracotta w-full sm:w-auto sm:px-10"
            >
              {loading ? (
                <>
                  <span className="hand-spinner h-5 w-5" />
                  Verifying…
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
