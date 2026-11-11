'use client';

import { useState } from 'react';
import * as api from '../lib/api';
import { CATEGORIES, buildPayload, missingCategories } from '../lib/categories';
import type { StaffMember, Nominations } from '../types';
import { Check, ClipboardDoodle, IconBadge } from './Doodles';
import { NominatorBanner, Note, PageHeader } from './WizardChrome';

interface Props {
  nominator: StaffMember;
  // The same object the form's dropdowns are bound to.
  nominations: Nominations;
  onBack: () => void;
  // Called only after the API accepted the submission.
  onSubmitted: () => void;
  onStartOver: () => void;
}

export default function ReviewPage({ nominator, nominations, onBack, onSubmitted, onStartOver }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const missing = missingCategories(nominations);
  const payload = buildPayload(nominator, nominations);

  const handleSubmit = async () => {
    if (!payload) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      // request() throws on any non-2xx, so reaching the next line means 200/201.
      await api.submitNomination(payload);
      onSubmitted();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-0 mb-2">
      <PageHeader
        icon={
          <IconBadge>
            <ClipboardDoodle className="h-10 w-10 text-green-700" />
          </IconBadge>
        }
        title="Review Your Nominations"
        subtitle="Please confirm before submitting"
      />

      {/* Clipboard */}
      <div className="relative mt-5">
        {/* Clip */}
        <div
          aria-hidden="true"
          className="absolute -top-6 left-1/2 z-10 flex h-11 w-32 -translate-x-1/2 items-start justify-center border-2 border-stone-800 bg-stone-500 pt-2 shadow-[2px_3px_0px_0px_rgba(41,37,36,1)] rounded-[0.8rem_0.8rem_0.4rem_0.4rem]"
        >
          <span className="h-3 w-12 rounded-full border-2 border-stone-800 bg-paper" />
        </div>

        <div className="hand-drawn-border-alt bg-[#E8D9BF] p-3 sm:p-4">
          <div className="border-2 border-stone-800 bg-card px-4 pb-3 pt-8 sm:px-5 rounded-[0.6rem_1rem_0.5rem_1.2rem]">
            <NominatorBanner
              label="Submitting as"
              name={nominator.full_name}
              onStartOver={onStartOver}
              disabled={submitting}
            />

            {missing.length > 0 && (
              <div className="mb-5">
                <Note tone="warning">
                  {missing.length === 1 ? 'One category is' : `${missing.length} categories are`} still
                  empty: {missing.map(c => c.label).join(', ')}. Go back and complete{' '}
                  {missing.length === 1 ? 'it' : 'them'} before submitting.
                </Note>
              </div>
            )}

            {/* Checklist */}
            <ul className="divide-y-2 divide-dashed divide-stone-200">
              {CATEGORIES.map(({ key, label }) => {
                const nominee = nominations[key];
                return (
                  <li key={key} className="flex items-center gap-3 py-1 sm:gap-4">
                    <span className="hand-checkbox">
                      {nominee && <Check className="h-5 w-5 text-green-700" />}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 sm:text-sm sm:normal-case sm:tracking-normal sm:text-stone-600">
                        {label}
                      </span>
                      {nominee ? (
                        <span className="font-hand text-2xl font-bold leading-tight text-stone-900 sm:text-right">
                          {nominee.full_name}
                        </span>
                      ) : (
                        <span className="font-hand text-2xl font-semibold leading-tight text-orange-700 sm:text-right">
                          Not selected
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {submitError && (
              <div className="mt-5">
                <Note tone="error">{submitError}</Note>
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onBack}
                disabled={submitting}
                className="sticker sticker-plain text-xl"
              >
                ← Go Back and Edit
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !payload}
                className="sticker sticker-mustard px-8 py-4 text-3xl"
              >
                {submitting ? (
                  <>
                    <span className="hand-spinner h-5 w-5" />
                    Submitting…
                  </>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
