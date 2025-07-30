export interface Crewmate {
  id: string;
  name: string;
  speed: number;
  color: string;
  category?: string; // For stretch features
  success_metric?: string; // For stretch features
  is_favorite?: boolean; // Phase 4: Favorites system
  created_at: string;
  updated_at: string;
}

export interface CrewmateFormData {
  name: string;
  speed: number;
  color: string;
  category?: string;
  success_metric?: string;
  is_favorite?: boolean;
}

export const CREWMATE_COLORS = [
  "red",
  "blue",
  "green",
  "pink",
  "orange",
  "yellow",
  "black",
  "white",
  "purple",
  "brown",
  "cyan",
  "lime",
] as const;

export type CrewmateColor = (typeof CREWMATE_COLORS)[number];
