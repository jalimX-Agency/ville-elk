/** Why the owner closed the villa; shown only in the dashboard. */
export const CLOSURE_REASONS = {
  reservation: "Réservation hors site",
  travaux: "Travaux / entretien",
  proprietaire: "Séjour du propriétaire",
  autre: "Autre",
} as const;

export type ClosureReason = keyof typeof CLOSURE_REASONS;

export const isClosureReason = (value: string): value is ClosureReason => value in CLOSURE_REASONS;
