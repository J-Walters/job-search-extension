interface FormFields {
  keywords: string;
  searchRadius: number;
  time: string;
  sortBy: string;
}

interface SavedSearch extends FormFields {
  id: string;
  url: string;
  created_at: string;
}

type TimeFrameKey = 'r1800' | 'r3600' | 'r7200' | 'r86400';

type EditableFields = Pick<SavedSearch, 'keywords' | 'searchRadius' | 'time'>;

export type {FormFields, SavedSearch, TimeFrameKey, EditableFields} 