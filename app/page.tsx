'use client';

import { useState } from 'react';
import WelcomePage from '../components/WelcomePage';
import VerifyPage from '../components/VerifyPage';
import NominationForm from '../components/NominationForm';
import ReviewPage from '../components/ReviewPage';
import ThankYouPage from '../components/ThankYouPage';
import type { StaffMember, NominationPayload } from '../types';

type Step = 'welcome' | 'verify' | 'nominate' | 'review' | 'thankyou';

export default function Home() {
  const [step, setStep] = useState<Step>('welcome');
  const [verifiedStaff, setVerifiedStaff] = useState<StaffMember | null>(null);
  const [pendingPayload, setPendingPayload] = useState<NominationPayload | null>(null);

  const handleVerified = (staff: StaffMember) => {
    setVerifiedStaff(staff);
    setStep('nominate');
  };

  const handleReview = (payload: NominationPayload) => {
    setPendingPayload(payload);
    setStep('review');
  };

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-8">
      {step === 'welcome' && (
        <WelcomePage onStart={() => setStep('verify')} />
      )}

      {step === 'verify' && (
        <VerifyPage onVerified={handleVerified} />
      )}

      {step === 'nominate' && verifiedStaff && (
        <NominationForm
          nominator={verifiedStaff}
          initialSelections={pendingPayload ?? undefined}
          onReview={handleReview}
        />
      )}

      {step === 'review' && verifiedStaff && pendingPayload && (
        <ReviewPage
          nominator={verifiedStaff}
          payload={pendingPayload}
          onBack={() => setStep('nominate')}
          onSubmitted={() => setStep('thankyou')}
        />
      )}

      {step === 'thankyou' && <ThankYouPage />}
    </main>
  );
}
