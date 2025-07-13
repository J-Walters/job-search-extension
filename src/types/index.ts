export interface FormFields {
  keywords: string;
  searchRadius: number;
  time: string;
  sortBy: string;
}

export interface SavedSearch extends FormFields {
  id: string;
  url: string;
  created_at: string;
}

export type TimeFrameKey = 'r1800' | 'r3600' | 'r7200' | 'r86400';