export interface StaffMember {
  id: number;
  full_name: string;
}

export interface VerifyResponse {
  found: boolean;
  staff?: StaffMember;
}

// GET /api/verify/search result (camelCase, straight from Prisma)
export interface StaffSearchResult {
  id: number;
  fullName: string;
}

export interface NominationPayload {
  nominator_id: number;
  best_staff_male_id: number;
  best_staff_female_id: number;
  best_dressed_male_id: number;
  best_dressed_female_id: number;
  most_social_staff_id: number;
  best_team_player_id: number;
  most_supportive_staff_id: number;
}

export interface NominationResponse {
  success: boolean;
  message?: string;
}

export type CategoryKey =
  | 'best_staff_male'
  | 'best_staff_female'
  | 'best_dressed_male'
  | 'best_dressed_female'
  | 'most_social_staff'
  | 'best_team_player'
  | 'most_supportive_staff';

export interface CategoryDefinition {
  key: CategoryKey;
  payloadKey: keyof Omit<NominationPayload, 'nominator_id'>;
  label: string;
  gender: 'male' | 'female' | 'all';
}

// What the dropdowns are bound to and what the Review page reads:
// nominations.best_staff_male = { id: 1, full_name: 'Kolapo Taofeeq' }
export type Nominations = Partial<Record<CategoryKey, StaffMember>>;

// Steps: 1 Welcome · 2 Verify · 3 Nominate · 4 Review
export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardState {
  step: WizardStep;
  verifiedStaff: StaffMember | null;
  nominations: Nominations;
}
