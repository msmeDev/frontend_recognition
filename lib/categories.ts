import type { CategoryDefinition, Nominations, NominationPayload, StaffMember } from '../types';

// Single source of truth for the 7 categories, shared by the form and the review page.
export const CATEGORIES: CategoryDefinition[] = [
  { key: 'best_staff_male',       payloadKey: 'best_staff_male_id',       label: 'Best Staff Male',       gender: 'male'   },
  { key: 'best_staff_female',     payloadKey: 'best_staff_female_id',     label: 'Best Staff Female',     gender: 'female' },
  { key: 'best_dressed_male',     payloadKey: 'best_dressed_male_id',     label: 'Best Dressed Male',     gender: 'male'   },
  { key: 'best_dressed_female',   payloadKey: 'best_dressed_female_id',   label: 'Best Dressed Female',   gender: 'female' },
  { key: 'most_social_staff',     payloadKey: 'most_social_staff_id',     label: 'Most Social Staff',     gender: 'all'    },
  { key: 'best_team_player',      payloadKey: 'best_team_player_id',      label: 'Best Team Player',      gender: 'all'    },
  { key: 'most_supportive_staff', payloadKey: 'most_supportive_staff_id', label: 'Most Supportive Staff', gender: 'all'    },
];

export function missingCategories(nominations: Nominations): CategoryDefinition[] {
  return CATEGORIES.filter(c => !nominations[c.key]);
}

export function isComplete(nominations: Nominations): boolean {
  return missingCategories(nominations).length === 0;
}

// Returns null if any category is still empty.
export function buildPayload(
  nominator: StaffMember,
  nominations: Nominations,
): NominationPayload | null {
  if (!isComplete(nominations)) return null;
  const payload = { nominator_id: nominator.id } as NominationPayload;
  for (const c of CATEGORIES) {
    payload[c.payloadKey] = nominations[c.key]!.id;
  }
  return payload;
}
