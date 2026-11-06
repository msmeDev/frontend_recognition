'use client';

import { useState } from 'react';
import * as api from '../lib/api';
import type { StaffMember } from '../types';

interface Props {
  onVerified: (staff: StaffMember) => void;
}

export default function VerifyPage({ onVerified }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Step 1: verify name exists in staff list
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
          Please enter your full name exactly as it appears in the staff directory
          to confirm your identity and continue.
        </p>

        <form onSubmit={handleVerify} noValidate>
          <label
            htmlFor="staff-name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Full Name
          </label>
          <input
            id="staff-name"
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g. James Okonkwo"
            autoComplete="name"
            autoFocus
            disabled={loading}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:bg-slate-50 disabled:cursor-not-allowed transition-shadow"
          />

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
