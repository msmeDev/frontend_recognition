'use client';

import { useEffect, useState } from 'react';
import WelcomePage from '../components/WelcomePage';
import VerifyPage from '../components/VerifyPage';
import NominationForm from '../components/NominationForm';
import ReviewPage from '../components/ReviewPage';
import ThankYouPage from '../components/ThankYouPage';
import { isComplete } from '../lib/categories';
import { INITIAL_WIZARD, clearDraft, isInitial, loadDraft, saveDraft } from '../lib/draft';
import type { Nominations, StaffMember, WizardState } from '../types';

export default function Home() {
  // The whole wizard's progress lives in one object, mirrored to localStorage.
  const [wizard, setWizard] = useState<WizardState>(INITIAL_WIZARD);
  // False until the stored draft has been read. Server render and first client
  // render both use INITIAL_WIZARD, so there's no hydration mismatch.
  const [hydrated, setHydrated] = useState(false);
  // Thank-you is shown after the draft is wiped, so it is deliberately not persisted.
  const [submitted, setSubmitted] = useState(false);

  // Restore a saved draft once, on first load in the browser.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) setWizard(draft);
    setHydrated(true);
  }, []);

  // Save on every change (after restore, so we don't overwrite the draft with the
  // empty initial state). A blank wizard leaves nothing behind in storage.
  useEffect(() => {
    if (!hydrated) return;
    if (isInitial(wizard)) clearDraft();
    else saveDraft(wizard);
  }, [wizard, hydrated]);

  const handleVerified = (staff: StaffMember) => {
    setWizard(w => ({
      step: 3,
      verifiedStaff: staff,
      // Picks made under a different name don't carry over.
      nominations: w.verifiedStaff?.id === staff.id ? w.nominations : {},
    }));
  };

  const handleNominationsChange = (nominations: Nominations) => {
    setWizard(w => ({ ...w, nominations }));
  };

  const handleReview = () => {
    setWizard(w => (isComplete(w.nominations) ? { ...w, step: 4 } : w));
  };

  // Shared devices: let the next person discard someone else's draft.
  const handleStartOver = () => {
    if (!window.confirm('Are you sure? This will clear your current progress.')) return;
    clearDraft();
    setWizard(INITIAL_WIZARD);
  };

  const handleSubmitted = () => {
    clearDraft();
    setWizard(INITIAL_WIZARD);
    setSubmitted(true);
  };

  const { step, verifiedStaff, nominations } = wizard;

  if (!hydrated) {
    return <main className="min-h-screen" aria-busy="true" />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-2">
      {submitted ? (
        <ThankYouPage />
      ) : (
        <>
          {step === 1 && (
            <WelcomePage onStart={() => setWizard(w => ({ ...w, step: 2 }))} />
          )}

          {step === 2 && <VerifyPage onVerified={handleVerified} />}

          {step === 3 && verifiedStaff && (
            <NominationForm
              nominator={verifiedStaff}
              nominations={nominations}
              onChange={handleNominationsChange}
              onReview={handleReview}
              onStartOver={handleStartOver}
            />
          )}

          {step === 4 && verifiedStaff && (
            <ReviewPage
              nominator={verifiedStaff}
              nominations={nominations}
              onBack={() => setWizard(w => ({ ...w, step: 3 }))}
              onSubmitted={handleSubmitted}
              onStartOver={handleStartOver}
            />
          )}
        </>
      )}
    </main>
  );
}
