'use client';

import { useState } from 'react';
import WelcomePage from '../components/WelcomePage';
import VerifyPage from '../components/VerifyPage';
import NominationForm from '../components/NominationForm';
import ThankYouPage from '../components/ThankYouPage';
import type { StaffMember } from '../types';

type Step = 'welcome' | 'verify' | 'nominate' | 'thankyou';

export default function Home() {
  const [step, setStep] = useState<Step>('welcome');
  const [verifiedStaff, setVerifiedStaff] = useState<StaffMember | null>(null);

  const handleVerified = (staff: StaffMember) => {
    setVerifiedStaff(staff);
    setStep('nominate');
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
          onSubmitted={() => setStep('thankyou')}
        />
      )}

      {step === 'thankyou' && <ThankYouPage />}
    </main>
  );
}
