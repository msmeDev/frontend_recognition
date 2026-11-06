export interface StaffMember {
  id: number;
  full_name: string;
}

export interface VerifyResponse {
  found: boolean;
  staff?: StaffMember;
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

export interface CategoryDefinition {
  key: keyof Omit<NominationPayload, 'nominator_id'>;
  label: string;
  gender: 'male' | 'female' | 'all';
}
