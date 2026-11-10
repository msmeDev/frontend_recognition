import type { Nominations, StaffMember, WizardState, WizardStep } from '../types';
import { CATEGORIES, isComplete } from './categories';

export const DRAFT_KEY = 'msme_nomination_draft';

export const INITIAL_WIZARD: WizardState = {
  step: 1,
  verifiedStaff: null,
  nominations: {},
};

function isStaff(v: unknown): v is StaffMember {
  return (
    typeof v === 'object' &&
    v !== null &&
    Number.isInteger((v as StaffMember).id) &&
    (v as StaffMember).id > 0 &&
    typeof (v as StaffMember).full_name === 'string'
  );
}

// Parse and sanity-check a stored draft. Anything malformed is dropped, and the
// step is pulled back if the data it needs is missing (e.g. Review without all 7).
function parseDraft(raw: string): WizardState | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, unknown>;

  const verifiedStaff = isStaff(d.verifiedStaff) ? d.verifiedStaff : null;

  const nominations: Nominations = {};
  if (typeof d.nominations === 'object' && d.nominations !== null) {
    const n = d.nominations as Record<string, unknown>;
    for (const c of CATEGORIES) {
      const v = n[c.key];
      if (isStaff(v)) nominations[c.key] = { id: v.id, full_name: v.full_name };
    }
  }

  let step: WizardStep = [1, 2, 3, 4].includes(d.step as number) ? (d.step as WizardStep) : 1;
  if (step >= 3 && !verifiedStaff) step = 2;
  if (step === 4 && !isComplete(nominations)) step = 3;

  return { step, verifiedStaff, nominations };
}

// localStorage can throw (private mode, blocked storage) — never let that break the wizard.
export function loadDraft(): WizardState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? parseDraft(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(state: WizardState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — progress just won't survive a refresh */
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function isInitial(state: WizardState): boolean {
  return (
    state.step === 1 &&
    state.verifiedStaff === null &&
    Object.keys(state.nominations).length === 0
  );
}
